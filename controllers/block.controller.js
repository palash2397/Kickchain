import Joi from "joi";
import mongoose from "mongoose";

import { ApiResponse } from "../utils/ApiResponse.js";
import { Msg } from "../utils/responseMsg.js";

import { User } from "../models/user/user.js";
import { BlockUser } from "../models/block/BlockUser.js";
import { FriendRequest } from "../models/friends/FriendRequest.js";

export const blockUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { blockedUserId } = req.params;

    const schema = Joi.object({
      blockedUserId: Joi.string().required().messages({
        "string.empty": "Blocked user ID is required",
        "any.required": "Blocked user ID is required",
      }),
    });

    const { error } = schema.validate({ blockedUserId });
    if (error) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, error.details[0].message));
    }

    if (!mongoose.Types.ObjectId.isValid(blockedUserId)) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Invalid blocked user ID"));
    }

    if (userId.toString() === blockedUserId.toString()) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, Msg.CANNOT_BLOCK_SELF));
    }

    // run these in parallel
    const [user, alreadyBlocked] = await Promise.all([
      User.findById(blockedUserId).select("_id").lean(),
      BlockUser.findOne({
        blockedBy: userId,
        blockedUser: blockedUserId,
      })
        .select("_id")
        .lean(),
    ]);

    if (!user) {
      return res.status(404).json(new ApiResponse(404, {}, Msg.USER_NOT_FOUND));
    }

    if (alreadyBlocked) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, Msg.ALREADY_BLOCKED));
    }

    const blockEntry = await BlockUser.create({
      blockedBy: userId,
      blockedUser: blockedUserId,
    });

    // do not wait for delete if not needed in response
    FriendRequest.deleteMany({
      $or: [
        { sender: userId, receiver: blockedUserId },
        { sender: blockedUserId, receiver: userId },
      ],
    }).catch((err) => {
      console.error("Friend request cleanup failed:", err);
    });

    return res
      .status(201)
      .json(new ApiResponse(201, blockEntry, Msg.BLOCKED_USER));
  } catch (error) {
    console.log(`error while blocking user: ${error}`);
    return res.status(500).json(new ApiResponse(500, {}, Msg.SERVER_ERROR));
  }
};

export const unblockUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { blockedUserId } = req.params;

    const schema = Joi.object({
      blockedUserId: Joi.string().required().messages({
        "string.empty": "Blocked user ID is required",
        "any.required": "Blocked user ID is required",
      }),
    });

    const { error } = schema.validate({ blockedUserId });

    if (error) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, error.details[0].message));
    }

    if (userId === blockedUserId) {
      return res.status(400).json(new ApiResponse(400, {}, Msg.CANNOT_UNBLOCK_SELF));
    }

    const user = await User.findById(blockedUserId);
    if (!user) {
      return res.status(404).json(new ApiResponse(404, {}, Msg.USER_NOT_FOUND));
    }

    const blockEntry = await BlockUser.findOneAndDelete({
      blockedBy: userId,
      blockedUser: blockedUserId,
    });

    if (!blockEntry) {
      return res.status(404).json(new ApiResponse(404, {}, Msg.NOT_BLOCKED));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, blockEntry, Msg.USER_UNBLOCKED_SUCCESSFULLY));
  } catch (error) {
    console.log(`error while unblocking user: ${error.message}`);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, Msg.SERVER_ERROR));
  }
};

export const BlockedUsers = async (req, res) => {
  try {
    const userId = req.user.id;

    const blockedUsers = await BlockUser.find({ blockedBy: userId })
      .populate("blockedUser", "name email avatar gender")
      .sort({ createdAt: -1 });

    console.log(blockedUsers);

    if (!blockedUsers || blockedUsers.length == 0) {
      return res.status(200).json(new ApiResponse(200, {}, Msg.NO_BLOCKED_USERS));
    }

    blockedUsers.forEach((block) => {
      block.blockedUser.avatar = block.blockedUser.avatar ? `${process.env.BASE_URL}/profile/${block.blockedUser.avatar}` : null;
    });

    return res
      .status(200)
      .json(new ApiResponse(200, blockedUsers, Msg.BLOCKED_USERS_FETCHED));
  } catch (error) {
    console.log(`error while getting blocked users: ${error.message}`);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, Msg.SERVER_ERROR));
  }
};

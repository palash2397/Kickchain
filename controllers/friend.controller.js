import Joi from "joi";
import mongoose from "mongoose";

import { ApiResponse } from "../utils/ApiResponse.js";
import { Msg } from "../utils/responseMsg.js";

import { createAndSendNotification } from "../utils/firbase/createAndSendNotification.js";

import { FriendRequest } from "../models/friends/FriendRequest.js";
import { User } from "../models/user/user.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.user.id; // from auth middleware
    const { receiverId } = req.params;

    const schema = Joi.object({
      receiverId: Joi.string().required().messages({
        "string.empty": "Receiver ID is required",
      }),
    });

    const { error } = schema.validate({ receiverId });
    if (error) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, error.details[0].message));
    }

    if (senderId === receiverId) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, Msg.FRIEND_CANNOT_SEND_TO_SELF));
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, Msg.RECEIVER_NOT_FOUND));
    }

    const existing = await FriendRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    if (existing) {
      if (existing.status === "pending") {
        return res
          .status(400)
          .json(new ApiResponse(400, {}, Msg.FRIEND_REQUEST_ALREADY_SENT));
      }

      if (existing.status === "accepted") {
        return res
          .status(400)
          .json(new ApiResponse(400, {}, Msg.FRIEND_ALREADY_FRIENDS));
      }

      if (
        existing.sender.toString() === senderId &&
        existing.receiver.toString() === receiverId
      ) {
        existing.status = "pending";
        await existing.save();

        return res
          .status(200)
          .json(new ApiResponse(200, existing, Msg.FRIEND_REQUEST_SENT_AGAIN));
      }

      const newRequest = await FriendRequest.create({
        sender: senderId,
        receiver: receiverId,
        status: "pending",
      });

      return res
        .status(201)
        .json(new ApiResponse(201, newRequest, Msg.FRIEND_REQUEST_SENT));
    }

    const friendRequest = await FriendRequest.create({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    await createAndSendNotification({
      type: "friendRequest",
      userId: receiverId,
      title: "Friend Request",
      message: "You have a new friend request",
      data: {
        friendRequestId: friendRequest._id,
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, friendRequest, Msg.FRIEND_REQUEST_SENT));
  } catch (error) {
    console.error("Error sending friend request:", error);
    return res.status(500).json(new ApiResponse(500, {}, Msg.SERVER_ERROR));
  }
};

export const friendRequestStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { requestId, status } = req.body;

    const request = await FriendRequest.findOne({
      _id: requestId,
      receiver: userId,
      status: "pending",
    });

    if (!request) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, Msg.FRIEND_REQUEST_NOT_FOUND));
    }

    request.status = status;
    await request.save();

    // await createAndSendNotification({
    //   type: "friendRequest",
    //   userId: request.sender,
    //   title: "Friend Request",
    //   message: "You have a new friend request",
    //   data: {
    //     friendRequestId: request._id,
    //   },
    // });

    return res
      .status(200)
      .json(
        new ApiResponse(200, request, `Friend request ${status} successfully`),
      );
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, {}, Msg.SERVER_ERROR));
  }
};

export const incomingRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await FriendRequest.find({
      receiver: userId,
      status: "pending",
    })
      .populate("sender", "name email phoneNumber avatar")
      .sort({ createdAt: -1 });

    if (!requests || requests.length === 0) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, Msg.NO_INCOMING_REQUESTS));
    }

    requests.map((request) => {
      request.sender.avatar = request.sender.avatar
        ? `${process.env.BASE_URL}/profile/${request.sender.avatar}`
        : null;
    });

    return res
      .status(200)
      .json(new ApiResponse(200, requests, Msg.FRIEND_REQUESTS_FETCHED));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, {}, Msg.SERVER_ERROR));
  }
};

export const outgoingRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await FriendRequest.find({
      sender: userId,
      status: "pending",
    })
      .populate("receiver", "name email phoneNumber avatar")
      .sort({ createdAt: -1 });

    if (!requests || requests.length === 0) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, Msg.NO_OUTGOING_REQUESTS));
    }

    requests.map((request) => {
      request.receiver.avatar = request.receiver.avatar
        ? `${process.env.BASE_URL}/profile/${request.receiver.avatar}`
        : null;
    });

    return res
      .status(200)
      .json(new ApiResponse(200, requests, Msg.FRIEND_REQUESTS_FETCHED));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, {}, Msg.SERVER_ERROR));
  }
};
// decline friend request
// export const declineFriendRequest = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { requestId } = req.params;

//     const request = await FriendRequest.findOne({
//       _id: requestId,
//       receiver: userId,
//       status: 'pending',
//     });

//     if (!request) {
//       return res.status(404).json({
//         success: false,
//         message: 'Friend request not found',
//       });
//     }

//     request.status = 'declined';
//     await request.save();

//     return res.status(200).json({
//       success: true,
//       message: 'Friend request declined successfully',
//       data: request,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: 'Something went wrong',
//       error: error.message,
//     });
//   }
// };

export const friends = async (req, res) => {
  try {
    const userId = req.user.id;

    const friendsData = await FriendRequest.find({
      status: "accepted",
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "name email phoneNumber avatar")
      .populate("receiver", "name email phoneNumber avatar")
      .sort({ updatedAt: -1 });

    if (!friendsData || friendsData.length === 0) {
      return res.status(400).json(new ApiResponse(400, {}, Msg.NO_FRIENDS));
    }

    const friends = friendsData.map((item) => {
      const isSender = item.sender._id.toString() === userId;

      const friend = isSender ? item.receiver : item.sender;
      friend.avatar = friend.avatar
        ? `${process.env.BASE_URL}/profile/${friend.avatar}`
        : null;

      return friend;
    });

    return res
      .status(200)
      .json(new ApiResponse(200, friends, Msg.FRIENDS_FETCHED));
  } catch (error) {
    console.error("Error fetching friends:", error);
    return res.status(500).json(new ApiResponse(500, {}, Msg.SERVER_ERROR));
  }
};

export const unfriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.params;

    const request = await FriendRequest.findOne({
      status: "accepted",
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId },
      ],
    });

    if (!request) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, Msg.FRIEND_NOT_FOUND));
    }

    await FriendRequest.findByIdAndDelete(request._id);

    return res.status(200).json(new ApiResponse(200, {}, Msg.FRIEND_REMOVED));
  } catch (error) {
    console.log(`error while removing friend: ${error.message}`);
    return new ApiResponse(500, {}, Msg.SERVER_ERROR);
  }
};

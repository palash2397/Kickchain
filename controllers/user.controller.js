import Joi from "joi";
import jwt from "jsonwebtoken";

import { ApiResponse } from "../utils/ApiResponse.js";
import { Msg } from "../utils/responseMsg.js";
import { generateOtp, getExpirationTime } from "../utils/helpers.js";

import User from "../models/user/user.js";

export const userRegister = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, gender } = req.body;
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phoneNumber: Joi.string().required(),
      password: Joi.string().required(),
      gender: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res
        .status(400)
        .json(new ApiResponse(400, {}, error.details[0].message));

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { phoneNumber }],
    });

    if (existingUser)
      return res.status(400).json(new ApiResponse(400, {}, Msg.USER_EXISTS));

    const otp = generateOtp();
    const otpExpiration = getExpirationTime();

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phoneNumber,
      password,
      gender,
      avatar: req.file ? req.file.filename : null,
      otp,
      otpExpireAt: otpExpiration,
    });
    return res.status(200).json(new ApiResponse(200, user, Msg.SUCCESS));
  } catch (error) {
    console.log(`error while user registerign`, error);
    return res.status(500).json(new ApiResponse(500, {}, Msg.SERVER_ERROR));
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const schema = Joi.object({
      email: Joi.string().required(),
      otp: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res
        .status(400)
        .json(new ApiResponse(400, {}, error.details[0].message));

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user)
      return res.status(400).json(new ApiResponse(400, {}, Msg.USER_NOT_FOUND));

    if (!user.otp || !user.otpExpireAt) {
      return res.status(400).json(new ApiResponse(400, {}, Msg.OTP_NOT_FOUND));
    }

    if (user.otp !== otp || new Date() > user.otpExpireAt) {
      return res.status(400).json(new ApiResponse(400, {}, Msg.OTP_INVALID));
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, Msg.USER_ALREADY_VERIFIED));
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, Msg.USER_ALREADY_VERIFIED));
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpireAt = null;
    await user.save();

    return res.status(200).json(new ApiResponse(200, user, Msg.OTP_VERIFIED));
  } catch (error) {
    console.log(`error while verifying otp`, error);
    return res.status(500).json(new ApiResponse(500, {}, Msg.SERVER_ERROR));
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const schema = Joi.object({
      email: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res
        .status(400)
        .json(new ApiResponse(400, {}, error.details[0].message));

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user)
      return res.status(400).json(new ApiResponse(400, {}, Msg.USER_NOT_FOUND));

    if (user.isVerified) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, Msg.USER_ALREADY_VERIFIED));
    }

    const otp = "9999";
    const otpExpiration = getExpirationTime();

    user.otp = otp;
    user.otpExpireAt = otpExpiration;
    await user.save();

    return res.status(200).json(new ApiResponse(200, user, Msg.OTP_RESENT));
  } catch (error) {
    console.log(`error while resending otp`, error);
    return res.status(500).json(new ApiResponse(500, {}, Msg.SERVER_ERROR));
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const schema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res
        .status(400)
        .json(new ApiResponse(400, {}, error.details[0].message));

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user)
      return res.status(400).json(new ApiResponse(400, {}, Msg.USER_NOT_FOUND));

    if (!user.isVerified)
      return res
        .status(400)
        .json(new ApiResponse(400, {}, Msg.USER_NOT_VERIFIED));

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect)
      return res
        .status(400)
        .json(new ApiResponse(400, {}, Msg.INVALID_CREDENTIALS));
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    return res.status(200).json(new ApiResponse(200, { token }, Msg.SUCCESS));
  } catch (error) {
    console.log(`error while user login`, error);
    return res.status(500).json(new ApiResponse(500, {}, Msg.SERVER_ERROR));
  }
};

export const myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json(new ApiResponse(404, {}, Msg.USER_NOT_FOUND));
    }
    user.avatar = user.avatar
      ? `${process.env.BASE_URL}/profile/${user.avatar}`
      : null;
    return res
      .status(200)
      .json(new ApiResponse(200, user, Msg.USER_PROFILE_FETCHED));
  } catch (error) {
    console.log(`error while getting user profile`, error);
    return res.status(500).json(new ApiResponse(500, {}, Msg.SERVER_ERROR));
  }
};

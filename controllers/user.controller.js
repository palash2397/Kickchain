import Joi from "joi";

import { ApiResponse } from "../utils/ApiResponse.js";
import { Msg } from "../utils/responseMsg.js";

import User from "../models/user/user.js";

export const userRegister = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, gender } = req.body;
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      password: Joi.string().required(),
      gender: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res
        .status(400)
        .json(new ApiResponse(400, {}, error.details[0].message));

    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { phoneNumber },
      ],
    });

    

    if (existingUser)
      return res.status(400).json(new ApiResponse(400, {}, Msg.USER_EXISTS));
     

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phoneNumber,
      password,
      gender,
      avatar: req.file ? req.file.filename : null,

    });
    return res.status(200).json(new ApiResponse(200, user, Msg.SUCCESS));
  } catch (error) {
    console.log(`error while user registerign`, error);
    return res.status(500).json(new ApiResponse(500, {}, Msg.SERVER_ERROR));
  }
};

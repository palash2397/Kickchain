import { ApiResponse } from "../utils/ApiResponse.js";
import { Msg } from "../utils/responseMsg.js";
import Joi from "joi";

export const userRegister = async (req, res) => {
  try {
    return new ApiResponse(200, {}, Msg.SUCCESS);
  } catch (error) {
    console.log(`error while user registerign`, error);
    return new ApiResponse(500, {}, Msg.SERVER_ERROR);
  }
};

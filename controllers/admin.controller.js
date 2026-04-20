import Joi from "joi";

import { ApiResponse } from "../utils/ApiResponse.js";
import { Msg } from "../utils/responseMsg.js";

import { Faq } from "../models/admin/Faq.js";
import { PrivacyPolicy } from "../models/admin/Policy.js";


export const createFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const schema = Joi.object({
      question: Joi.string().required(),
      answer: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, error.details[0].message));
    }

    const faq = await Faq.create({
      question,
      answer,
    });

    // return res.status(201).json({
    //   success: true,
    //   message: "FAQ created successfully",
    //   data: faq,
    // });
    return res
      .status(201)
      .json(new ApiResponse(201, faq, Msg.FAQ_CREATED_SUCCESSFULLY));
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return res.status(500).json(new ApiResponse(500, {}, Msg.SERVER_ERROR));
  }
};

export const getFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find();
    if (!faqs || faqs.length === 0) {
      return res.status(404).json(new ApiResponse(404, {}, Msg.FAQ_NOT_FOUND));
    }
    return res.status(200).json(new ApiResponse(200, faqs, Msg.FAQ_FETCHED));
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return res.status(500).json(new ApiResponse(500, {}, Msg.SERVER_ERROR));
  }
};

export const createPrivacyPolicy = async (req, res) => {
  try {
    const { headingOne, descriptionOne, headingTwo, descriptionTwo } = req.body;
    const schema = Joi.object({
      headingOne: Joi.string().required(),
      descriptionOne: Joi.string().required(),
      headingTwo: Joi.string().required(),
      descriptionTwo: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, error.details[0].message));
    }

    const privacyPolicy = await PrivacyPolicy.create({
      headingOne,
      descriptionOne,
      headingTwo,
      descriptionTwo,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, privacyPolicy, Msg.PRIVACY_POLICY_CREATED));
  } catch (error) {
    console.error("Error creating privacy policy:", error);
    return res.status(500).json(new ApiResponse(500, {}, Msg.SERVER_ERROR));
  }
};

export const getPrivacyPolicy = async (req, res) => {
  try {
    const privacyPolicy = await PrivacyPolicy.findOne();
    if (!privacyPolicy) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, Msg.PRIVACY_POLICY_NOT_FOUND));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, privacyPolicy, Msg.PRIVACY_POLICY_FETCHED));
  } catch (error) {
    console.error("Error fetching privacy policy:", error);
    return res.status(500).json(new ApiResponse(500, {}, Msg.SERVER_ERROR));
  }
};


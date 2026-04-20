import Joi from "joi";

import { ApiResponse } from "../utils/ApiResponse.js";
import { Msg } from "../utils/responseMsg.js";

import { Shop } from "../models/shop/shop.js";

export const createShopItem = async (req, res) => {
  try {
    const {
      category,
      name,
      description,
      price,
      isFree,
      isEquipped,
      coinAmount,
    } = req.body;
    const schema = Joi.object({
      category: Joi.string().required(),
      name: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.number().required(),
      isFree: Joi.boolean().required(),
      isEquipped: Joi.boolean().required(),
      coinAmount: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, error.details[0].message));
    }

    if (!req.file) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Image is required"));
    }

    const shopItem = await Shop.create({
      category,
      name,
      image: req.file.filename,
      description,
      price,
      isFree,
      isEquipped,
      coinAmount,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, shopItem, Msg.SHOP_ITEM_CREATED));
  } catch (error) {
    console.error("Error creating shop item:", error);
    return res.status(500).json(new ApiResponse(500, {}, Msg.SERVER_ERROR));
  }
};

export const getShopItems = async (req, res) => {
  try {
    const shopItems = await Shop.find({ category: req.params.category });
    if (!shopItems || shopItems.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, Msg.SHOP_ITEM_NOT_FOUND));
    }

    shopItems.forEach((item) => {
      item.image = `${process.env.BASE_URL}/shop/${item.image}`;
    });
    return res
      .status(200)
      .json(new ApiResponse(200, shopItems, Msg.SHOP_ITEMS_FETCHED));
  } catch (error) {
    console.error("Error fetching shop items:", error);
    return res.status(500).json(new ApiResponse(500, {}, Msg.SERVER_ERROR));
  }
};

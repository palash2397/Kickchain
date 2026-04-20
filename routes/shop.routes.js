import { Router } from "express";

import { createShopItem, getShopItems } from "../controllers/shop.controller.js";
import { auth, isAdmin } from "../middlewares/auth.js";

import { upload } from "../middlewares/multer.js";
import { setUploadPath } from "../utils/helpers.js";

const shopRouter = Router();

shopRouter.post(
  "/item",
  auth,
  isAdmin,
  setUploadPath("shop"),
  upload.single("image"),
  createShopItem,
);


shopRouter.get("/items/:category", auth, getShopItems);

export default shopRouter;

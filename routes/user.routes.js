import { Router } from "express";
import {
  userRegister,
  myProfile,
  verifyOtp,
  resendOtp,
  login,
  updateProfile,
  allUser
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.js";
import { setUploadPath } from "../utils/helpers.js";
import { auth } from "../middlewares/auth.js";

import { getShopItems } from "../controllers/shop.controller.js";

import { getFaqs, getPrivacyPolicy} from "../controllers/admin.controller.js";

const userRouter = Router();

userRouter.post(
  "/register",
  setUploadPath("profile"),
  upload.single("avatar"),
  userRegister,
);

userRouter.post("/login", login);
userRouter.patch("/verify-otp", verifyOtp);
userRouter.patch("/resend-otp", resendOtp);
userRouter.get("/profile", auth, myProfile);
userRouter.patch(
  "/profile",
  setUploadPath("profile"),
  upload.single("avatar"),
  auth,
  updateProfile,
);

userRouter.get("/faqs", auth, getFaqs);
userRouter.get("/privacy-policy", auth, getPrivacyPolicy);
userRouter.get("/all", auth, allUser);

userRouter.get("/shop/items/:category", auth, getShopItems);
export default userRouter;

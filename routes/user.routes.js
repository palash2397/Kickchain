import { Router } from "express";
import {
  userRegister,
  myProfile,
  verifyOtp,
  resendOtp,
  login,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.js";
import { setUploadPath } from "../utils/helpers.js";
import { auth } from "../middlewares/auth.js";

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

export default userRouter;

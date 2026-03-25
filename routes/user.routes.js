import { Router } from "express";
import { userRegister } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.js";
import { setUploadPath } from "../utils/helpers.js";

const userRouter = Router();

userRouter.post(
  "/register",
  setUploadPath("profile"),
  upload.single("avatar"),
  userRegister,
);

export default userRouter;

import { Router } from "express";
import { blockUser, unblockUser, BlockedUsers } from "../controllers/block.controller.js";
import { auth } from "../middlewares/auth.js";
const blockRouter = Router();

blockRouter.post("/block/:blockedUserId", auth, blockUser);
blockRouter.patch("/unblock/:blockedUserId", auth, unblockUser);
blockRouter.get("/users", auth, BlockedUsers);

export default blockRouter;
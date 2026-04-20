import { Router } from "express";
import {
  sendFriendRequest,
  incomingRequests,
  outgoingRequests,
  friendRequestStatus,
  friends,
  unfriend,
} from "../controllers/friend.controller.js";
import { auth } from "../middlewares/auth.js";

const friendRouter = Router();

friendRouter.post("/send/request/:receiverId", auth, sendFriendRequest);
friendRouter.get("/incoming/requests", auth, incomingRequests);
friendRouter.get("/outgoing/requests", auth, outgoingRequests);
friendRouter.patch("/request/status", auth, friendRequestStatus);
friendRouter.get("/friends", auth, friends);
friendRouter.delete("/unfriend/:friendId", auth, unfriend);

export default friendRouter;

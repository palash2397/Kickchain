import { Router } from "express";
import {
  myNotificationSettings,
  updateNotificationSettings,
  markAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  myNotifications

} from "../controllers/notification.controller.js";
import { auth } from "../middlewares/auth.js";

const notificationRouter = Router();

notificationRouter.get("/settings", auth, myNotificationSettings);
notificationRouter.put("/settings", auth, updateNotificationSettings);
notificationRouter.get("/my", auth, myNotifications);
notificationRouter.patch("/read/all", auth, markAllNotificationsAsRead);
notificationRouter.patch("/read/:id", auth, markAsRead);
notificationRouter.delete("/:id", auth, deleteNotification);

export default notificationRouter;

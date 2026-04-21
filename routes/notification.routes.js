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
notificationRouter.get("/", auth, myNotifications);
notificationRouter.put("/settings", auth, updateNotificationSettings);
notificationRouter.post("/read/:id", auth, markAsRead);
notificationRouter.post("/read/all", auth, markAllNotificationsAsRead);
notificationRouter.delete("/:id", auth, deleteNotification);

export default notificationRouter;

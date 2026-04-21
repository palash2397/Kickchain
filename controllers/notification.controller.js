import Joi from "joi";

import { Notification } from "../models/notification/notification.js";
import { NotificationSetting } from "../models/notification/setting.js";

import { ApiResponse } from "../utils/ApiResponse.js";
import { Msg } from "../utils/responseMsg.js";

export const myNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    // console.log(notifications);

    if (!notifications || notifications.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, Msg.NOTIFICATIONS_NOT_FOUND));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, notifications, Msg.NOTIFICATION_FETCHED));

    // return res.status(200).json({
    //   success: true,
    //   message: 'Notifications fetched successfully',
    //   data: notifications,
    // });
  } catch (error) {
    console.log(`error while getting my notifications: ${error}`);
    return res.status(500).json(new ApiResponse(500, {}, Msg.SERVER_ERROR));
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const schema = Joi.object({
      id: Joi.string().required(),
    });
    const { error } = schema.validate({ id });
    if (error) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, Msg.VALIDATION_ERROR));
    }

    const notification = await Notification.findOne({
      _id: id,
      user: req.user.id,
    });
    if (!notification) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, Msg.NOTIFICATION_NOT_FOUND));
    }
    notification.isRead = true;
    await notification.save();
    return res
      .status(200)
      .json(
        new ApiResponse(200, notification, Msg.NOTIFICATION_MARKED_AS_READ),
      );
  } catch (error) {
    console.log(`error while marking notification as read: ${error}`);
    return res.status(500).json(new ApiResponse(500, {}, Msg.SERVER_ERROR));
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {

    const data = await Notification.find({
      user: req.user.id,
      isRead: false,
    });

    if (!data || data.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, {}, Msg.NOTIFICATIONS_NOT_FOUND));
    }

    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { $set: { isRead: true } },
    );

    // console.log("markAllNotificationsAsRead data:", data);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, Msg.ALL_NOTIFICATIONS_MARKED_AS_READ));
  } catch (error) {
    console.log("markAllNotificationsAsRead error:", error);
    return res.status(500).json(new ApiResponse(500, {}, Msg.SERVER_ERROR));
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    console.log("deleteNotification notificationId:", notificationId);

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      user: req.user.id,
    });

    console.log("deleteNotification notification:", notification);

    if (!notification) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, Msg.NOTIFICATION_NOT_FOUND));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, Msg.NOTIFICATION_DELETED));
  } catch (error) {
    console.log("deleteNotification error:", error);
    return res.status(500).json(new ApiResponse(500, {}, Msg.SERVER_ERROR));
  }
};

export const myNotificationSettings = async (req, res) => {
  try {
    const settings = await NotificationSetting.findOne({ user: req.user.id });
    if (!settings) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, Msg.NOTIFICATION_SETTING_NOT_FOUND));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, settings, Msg.NOTIFICATION_SETTING_FETCHED));
  } catch (error) {
    console.log("myNotificationSettings error:", error);
    return res.status(500).json(new ApiResponse(500, {}, Msg.SERVER_ERROR));
  }
};

export const updateNotificationSettings = async (req, res) => {
  try {
    const {
      matchInvites,
      matchResults,
      payouts,
      referralRewards,
      systemUpdates,
    } = req.body;

    const settings = await NotificationSetting.findOneAndUpdate(
      { user: req.user.id },
      {
        $set: {
          ...(matchInvites !== undefined && { matchInvites }),
          ...(matchResults !== undefined && { matchResults }),
          ...(payouts !== undefined && { payouts }),
          ...(referralRewards !== undefined && { referralRewards }),
          ...(systemUpdates !== undefined && { systemUpdates }),
        },
      },
      { new: true, upsert: true },
    );

    return res
      .status(200)
      .json(new ApiResponse(200, settings, Msg.NOTIFICATION_SETTING_UPDATED));
  } catch (error) {
    console.log("Error updating notification settings:", error);
    return res.status(500).json(new ApiResponse(500, {}, Msg.SERVER_ERROR));
  }
};

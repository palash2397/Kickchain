import { Notification } from "../../models/notification/notification.js";
import { NotificationSetting } from "../../models/notification/setting.js";
import { User } from "../../models/user/user.js";
import { sendPushNotification } from "./pushNotification.js";

export const createAndSendNotification = async ({
  userId,
  type,
  title,
  message,
  data = {},
}) => {
  try {
    let settings = await NotificationSetting.findOne({ user: userId });

    if (!settings) {
      settings = await NotificationSetting.create({ user: userId });
    }

    let isPushAllowed = true;

    if (type === "matchInvite" && settings.matchInvites === false) {
      isPushAllowed = false;
    }

    if (type === "matchResult" && settings.matchResults === false) {
      isPushAllowed = false;
    }

    if (type === "payout" && settings.payouts === false) {
      isPushAllowed = false;
    }

    if (type === "friendRequest" && settings.other === false) {
      isPushAllowed = false;
    }

    if (type === "referralReward" && settings.referralRewards === false) {
      isPushAllowed = false;
    }

    if (type === "systemUpdate" && settings.systemUpdates === false) {
      isPushAllowed = false;
    }

    const notification = await Notification.create({
      user: userId,
      type,
      title,
      message,
      data,
      isRead: false,
    });

    if (isPushAllowed) {
      const user = await User.findById(userId).select("fcmToken");

      console.log("user:", user);

      if (user && user.fcmToken) {
        await sendPushNotification({
          token: user.fcmToken,
          title: title,
          body: message,
          data: {
            type: String(type),
            notificationId: String(notification._id),
          },
        });
      }
    }

    console.log("notification created:", notification);

    return notification;
  } catch (error) {
    console.log("createAndSendNotification error:", error);
    throw error;
  }
};

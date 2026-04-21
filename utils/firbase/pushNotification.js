import admin from "./config.js" 

export const sendPushNotification = async ({
  token,
  title,
  body,
  data = {},
}) => {
  try {
    if (!token) return;

    await admin.messaging().send({
      token,
      notification: {
        title,
        body,
      },
      data,
    });
    console.log("FCM send success");
  } catch (error) {
    console.log("FCM send error:", error);
  }
};

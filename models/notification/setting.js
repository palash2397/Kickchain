import mongoose from "mongoose";

const notificationSettingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    matchInvites: {
      type: Boolean,
      default: true,
    },
    matchResults: {
      type: Boolean,
      default: true,
    },
    payouts: {
      type: Boolean,
      default: true,
    },
    referralRewards: {
      type: Boolean,
      default: true,
    },
    systemUpdates: {
      type: Boolean,
      default: true,
    },

    other: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

export const NotificationSetting = mongoose.model("NotificationSetting", notificationSettingSchema);
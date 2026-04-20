import mongoose from "mongoose";

const blockUserSchema = new mongoose.Schema(
  {
    blockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blockedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

blockUserSchema.index({ blockedBy: 1, blockedUser: 1 }, { unique: true });

export const BlockUser = mongoose.model("BlockUser", blockUserSchema);

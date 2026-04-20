import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// one sender cannot send duplicate request to same receiver
friendRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

export const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);
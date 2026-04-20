import mongoose from "mongoose";


const shopSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['theme', 'ball', 'puck', 'currency'],
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: '',
    },

    description: {
      type: String,
      default: '',
      trim: true,
    },

    price: {
      type: Number,
      default: 0,
    },

    isFree: {
      type: Boolean,
      default: false,
    },

    isEquipped: {
      type: Boolean,
      default: false,
    },

    coinAmount: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Shop = mongoose.model("Shop", shopSchema);
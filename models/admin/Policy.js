import mongoose from "mongoose";

const privacyPolicySchema = new mongoose.Schema(
  {

    headingOne: {
      type: String,
      required: true,
      trim: true,
    },
    descriptionOne: {
      type: String,
      required: true,
      trim: true,
    },
    headingTwo: {
      type: String,
      required: true,
      trim: true,
    },
    descriptionTwo: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const PrivacyPolicy = mongoose.model(
  "PrivacyPolicy",
  privacyPolicySchema,
);

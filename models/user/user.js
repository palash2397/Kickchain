import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    countryCode: {
      type: String,
      required: false,
    },

    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    avatar: {
      type: String,
      default: null,
    },

    fcmToken: {
      type: String,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    otp: {
      type: String,
      default: null,
    },

    otpExpireAt: {
      type: Date,
      default: null,
    },
    // otpVerifiedForResetPassword: {
    //   type: Boolean,
    //   default: false,
    // },

    // hasActiveSubscription: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// Method to check password
userSchema.methods.isPasswordCorrect = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema);


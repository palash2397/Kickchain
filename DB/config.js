import mongoose from "mongoose";
import chalk from "chalk";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(chalk.green("MongoDB connected"));
  } catch (err) {
    console.error("MongoDB connection error", err);
    process.exit(1);
  }
};
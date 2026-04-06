import express from "express";
import morgan from "morgan";
import chalk from "chalk";
import "dotenv/config.js"

import { connectDB } from "./DB/config.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const port = process.env.PORT || 4006;

connectDB();

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1",express.static(path.join(__dirname, "public")));

import rootRouter from "./routes/root.routes.js";
app.use("/api/v1", rootRouter);

app.get("/api", (req, res) => {
  res.send("welcome to kickchain");
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});

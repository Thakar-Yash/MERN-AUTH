import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import profileRouter from "./routes/profileRoutes.js";

const app = express();
const port = Number(process.env.PORT) || 4000;

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

app.get("/", (req: Request, res: Response) => {
  res.send("Backend Running Successfully");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/profile", profileRouter);

app.listen(port, () => {
  console.log(`Server started on PORT ${port}`);
});
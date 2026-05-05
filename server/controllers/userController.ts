import { Request, Response } from "express";
import userModel from "../models/userModel.js";

interface AuthRequest extends Request {
  userId?: string;
}

export const getUserData = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User Not Found!",
      });
    }

    return res.json({
      success: true,
      userData: {
        name: user.name,
        isAccountVerfied: user.isAccountVerfied,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    return res.status(500).json({
      success: false,
      message,
    });
  }
};
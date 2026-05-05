import { Response } from "express";
import UserProfile from "../models/userProfile.js";
import userModel from "../models/userModel.js";
import { AuthRequest } from "../middlewares/userAuth.js";


// CREATE PROFILE
export const createProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    const existingProfile = await UserProfile.findOne({ userId });

    if (existingProfile) {
      res.status(400).json({
        success: false,
        message: "Profile already exists",
      });
      return;
    }

    const user = await userModel.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const profile = await UserProfile.create({
      userId,
      name: user.name,
      email: user.email,
      profileImage: req.file
        ? `/uploads/${req.file.filename}`
        : "",
    });

    res.status(201).json({
      success: true,
      profile,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET MY PROFILE
export const getMyProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const profile = await UserProfile.findOne({
      userId: req.userId,
    });

    if (!profile) {
      res.status(404).json({
        success: false,
        message: "Profile not found",
      });
      return;
    }

    res.json({
      success: true,
      profile,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// UPDATE PROFILE
export const updateProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const profile = await UserProfile.findOne({
      userId: req.userId,
    });

    if (!profile) {
      res.status(404).json({
        success: false,
        message: "Profile not found",
      });
      return;
    }

    if (req.file) {
      profile.profileImage = `/uploads/${req.file.filename}`;
    }

    await profile.save();

    res.json({
      success: true,
      profile,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
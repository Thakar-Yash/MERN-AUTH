import express from "express";
import upload from "../middlewares/upload.js";
import userAuth from "../middlewares/userAuth.js";

import {
  createProfile,
  getMyProfile,
  updateProfile,
} from "../controllers/profileController.js";

const profileRouter = express.Router();

profileRouter.post(
  "/create",
  userAuth,
  upload.single("profileImage"),
  createProfile
);

profileRouter.get(
  "/me",
  userAuth,
  getMyProfile
);

profileRouter.put(
  "/update",
  userAuth,
  upload.single("profileImage"),
  updateProfile
);

export default profileRouter;
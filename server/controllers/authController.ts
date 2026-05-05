import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

/* ================= TYPES ================= */

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface AuthRequest extends Request {
  userId?: string;
}

/* ================= HELPERS ================= */

const generateToken = (userId: string) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign({ id: userId }, secret, {
    expiresIn: "7d",
  });
};

const setTokenCookie = (res: Response, token: string) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

/* ================= REGISTER ================= */

export const register = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { name, email, password } = req.body as RegisterBody;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id.toString());

    setTokenCookie(res, token);

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to MERN Auth Project 🎉",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #4f46e5;">Welcome to MERN Auth Project 🚀</h2>

      <p>Hello <strong>${name}</strong>,</p>

      <p>Your account has been successfully created.</p>

      <div style="background:#f3f4f6; padding:15px; border-radius:8px;">
        <p><strong>Email:</strong> ${email}</p>
      </div>

      <p style="margin-top:20px;">
        Thank you for joining us. We’re excited to have you onboard!
      </p>

      <hr style="margin:30px 0;" />

      <p style="font-size:12px; color:gray;">
        This is an automated email from MERN Auth Project.
      </p>
    </div>
  `,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAccountVerfied: user.isAccountVerfied,
      },
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

/* ================= LOGIN ================= */

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body as LoginBody;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email & Password are required",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id.toString());

    setTokenCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAccountVerfied: user.isAccountVerfied,
      },
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

/* ================= LOGOUT ================= */

export const logout = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

/* ================= SEND VERIFY OTP ================= */

export const sendVerifyOtp = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found!",
      });
    }

    if (user.isAccountVerfied) {
      return res.status(400).json({
        success: false,
        message: "Account Already Verified!",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Verify Your Email Address",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #2563eb;">Email Verification</h2>

      <p>Hello <strong>${user.name}</strong>,</p>

      <p>Use the following OTP to verify your email address:</p>

      <div style="
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 8px;
        background: #eff6ff;
        color: #1d4ed8;
        padding: 15px;
        text-align: center;
        border-radius: 8px;
        margin: 20px 0;
      ">
        ${otp}
      </div>

      <p>This OTP will expire in <strong>24 hours</strong>.</p>

      <p>If you didn’t request this, please ignore this email.</p>

      <hr style="margin:30px 0;" />

      <p style="font-size:12px; color:gray;">
        MERN Auth Project Security Team
      </p>
    </div>
  `,
    });

    return res.status(200).json({
      success: true,
      message: "Verification OTP sent on Email!",
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

/* ================= VERIFY EMAIL ================= */

export const verifyEmail = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const { otp } = req.body;

    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found!",
      });
    }

    if (user.verifyOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP!",
      });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP is expired!",
      });
    }

    user.isAccountVerfied = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email Verification Success!",
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

/* ================= IS AUTHENTICATED ================= */

export const isAuthenticated = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  return res.status(200).json({
    success: true,
  });
};

/* ================= SEND RESET OTP ================= */

export const sendResetOtp = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found!",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Reset Your Password",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #dc2626;">Password Reset Request</h2>

      <p>Hello <strong>${user.name}</strong>,</p>

      <p>Use the OTP below to reset your password:</p>

      <div style="
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 8px;
        background: #fef2f2;
        color: #dc2626;
        padding: 15px;
        text-align: center;
        border-radius: 8px;
        margin: 20px 0;
      ">
        ${otp}
      </div>

      <p>This OTP will expire in <strong>24 hours</strong>.</p>

      <p>If you didn’t request password reset, please secure your account.</p>

      <hr style="margin:30px 0;" />

      <p style="font-size:12px; color:gray;">
        MERN Auth Project Security Team
      </p>
    </div>
  `,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email!",
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

/* ================= RESET PASSWORD ================= */

export const resetPassword = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Missing required details!",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found!",
      });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP!",
      });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP is expired!",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully!",
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};



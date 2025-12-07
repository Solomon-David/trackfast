// controllers/UserController.js

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateUserToken, generateStaffToken } from "../utils/generateTokens.js";
import sendEmail from "../utils/sendEmail.js";

// ===========================
// Register User (Customer)
// ===========================
export const register = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = await User.create({
      fullName,
      email,
      phone,
      password,
      role: "customer",
      subRole: null,
      isVerified: false,
      verificationCode,
      verificationCodeExpires: Date.now() + 10 * 60 * 1000
    });

    // Send verification email
    await sendEmail({
      to: email,
      subject: "Verify your Track Fast Account",
      html: `<p>Your verification code is <b>${verificationCode}</b></p>`
    });

    return res.status(201).json({
      message: "Account created. Verification code sent.",
      userId: newUser._id,
    });

  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

// ===========================
// Verify Email
// ===========================
export const verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ message: "Account already verified." });

    if (
      user.verificationCode !== verificationCode ||
      user.verificationCodeExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired verification code." });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    return res.json({ message: "Email verified successfully." });

  } catch (error) {
    console.error("Verify Email Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

// ===========================
// Login (Customer)
// ===========================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials." });

    if (!user.isVerified)
      return res.status(403).json({ message: "Account not verified." });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials." });

    const token = generateUserToken(user);

    return res.json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

// ===========================
// Staff Login (Admin, Warehouse, Driver, Support)
// ===========================
export const staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const staff = await User.findOne({ email });

    if (!staff)
      return res.status(400).json({ message: "Invalid credentials." });

    if (staff.role === "customer")
      return res.status(403).json({ message: "Access denied." });

    const match = await bcrypt.compare(password, staff.password);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials." });

    const token = generateStaffToken(staff);

    return res.json({
      message: "Staff login successful.",
      token,
      staff: {
        id: staff._id,
        fullName: staff.fullName,
        email: staff.email,
        role: staff.role,
        subRole: staff.subRole
      }
    });

  } catch (error) {
    console.error("Staff Login Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

// ===========================
// Forgot Password
// ===========================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found." });

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    await sendEmail({
      to: email,
      subject: "Password Reset",
      html: `<p>Your password reset token: <b>${resetToken}</b></p>`
    });

    return res.json({ message: "Password reset token sent." });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

// ===========================
// Reset Password
// ===========================
export const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.resetToken !== token)
      return res.status(400).json({ message: "Invalid token." });

    if (user.resetTokenExpires < Date.now())
      return res.status(400).json({ message: "Token expired." });

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    await user.save();

    return res.json({ message: "Password updated successfully." });

  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

// ===========================
// Get Profile
// ===========================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    return res.json({ user });

  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

/**
 * @desc    Logout user by clearing token on client
 * @route   POST /api/auth/logout
 * @access  Protected
 */
export const logout = (req, res) => {
  // Since JWT is stateless, just respond with success
  // Frontend should delete the token from localStorage/cookies
  res.status(200).json({ message: "Logged out successfully" });
};

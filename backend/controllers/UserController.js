// controllers/UserController.js

import User from "../models/User.js";
import crypto from "crypto";
import { generateUserToken, generateStaffToken } from "../utils/generateTokens.js";
import sendEmail from "../utils/sendEmail.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";

//Ensuring admin exists
export const ensureAdmin = async() => {
  const check = await User.findOne({email: process.env.EMAIL_USER});

  if(check){
    console.log("Admin exists.")
  }
  
  else{
    
    const hashedPassword = await hashPassword("Woga");
    
    const admin = await User.create({
      fullName: "The Admin",
      email: process.env.EMAIL_USER,
      password: hashedPassword,
      role: "admin",
      staffPosition: null,
      isVerified: true,
    });
    
    await admin.save();
    console.log("Admin created.")
  }
}

// ===========================
// Contact us (Customer)
// ===========================
  export const contactUs = async (req,res) => {
    try {
      const {fullName, email, message} = req.body;
      await sendEmail({
      to: process.env.EMAIL_USER,
      subject: "User contact",
      html: `<h2>Message from ${fullName}</h2>
            <h3>Email: ${email}</h3>
            <p><b>Message</b>: ${message}</p>`
    });
    return true;
    }catch(error){
    console.error("Register Error:", error);
    return false;
    }
  }

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

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      role: "customer",
      staffPosition: null,
      isVerified: false,
      verificationCode,
      verificationCodeExpires: Date.now() + (10 * 60 * 1000)
    });

    // Send verification email
    await sendEmail({
      to: email,
      subject: "Verify your Track Fast Account",
      html: `<h2>Welcome to Trackfast Logistics</h2>
            <p>Your partner in efficient delivery solutions.</p><br>
            <p>Your verification code is <b>${verificationCode}</b> and expires in 10 minutes.</p>`
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
export const verifyAccount = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ message: "Account already verified." });

    if (
      user.verificationCode !== code ||
      user.verificationCodeExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired verification code." });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

        // AUTO LOGIN
    const token = generateUserToken(user._id);

    return res.status(200).json({
      message: "Account verified successfully.",
      user: {
        id: user._id,
        fullName: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      token,
    });


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

    const match = await comparePassword(password, user.password);
    if (!match){
      return res.status(400).json({ message: "Invalid credentials." });
    }
    const token = generateUserToken(user);
    const userData = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    };
    return res.json({
      message: "Login successful.",
      token,
      user: userData
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

    const match = await comparePassword(password, staff.password);
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
      return res.status(404).json({ message: "User not found.", success: false });
    //reset token that is 6 characters long
    const resetToken = crypto.randomBytes(3).toString("hex").toUpperCase();

    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    await sendEmail({
      to: email,
      subject: "Password Reset",
      html: `<p>Your password reset token: <b>${resetToken}</b></p>`
    });

    return res.json({ message: "Password reset token sent.", success: true });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ message: "Server error.", success: false });
  }
};

// ===========================
// Reset Password
// ===========================
export const resetPassword = async (req, res) => {
  try {
    const { email, token, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.resetToken !== token)
      return res.status(409).json({ message: "Invalid token." });

    if (user.resetTokenExpires < Date.now())
      return res.status(409).json({ message: "Token expired." });

    user.password = await hashPassword(password);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    await user.save();

    return res.status(200).json({ message: "Password updated successfully." });

  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

// ===========================
// Change Password
// ===========================
export const changePassword = async (req, res) => {
  try {
     const { email, password, newPassword } = req.body;
     const user = await User.findOne({email});
     const passwordMatch = await comparePassword(password, user.password);
     if (passwordMatch) {
      user.password = await hashPassword(newPassword);
      await user.save();
      await sendEmail({
        to: email,
        subject: "Password Changed",
        html: `
        <h2>Password Successfully Changed</h2>
        <p>Dear ${user.fullName},</p>
        <p>We wanted to inform you that your account password has been successfully changed. If you did not initiate this change, please contact our support team immediately.</p>
        <p>Best regards,<br/>Track Fast Logistics Team</p>`
      });
      return res.status(200).json({message: "Password successfully changed."});
     }
     else {
      return res.status(409).json({message: "Incorrect password."});
     }
  } catch (error) {
    return res.status(500).json({ message: "Server error occurred."});
  }
}

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

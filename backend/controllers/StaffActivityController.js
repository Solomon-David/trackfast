// controllers/StaffActivityController.js

import User from "../models/User.js";
import bcrypt from "bcryptjs";


export const createStaff = async (req, res) => {
  try {
    const { fullName, email, phone, password, role, subRole } = req.body;

    // Check if email already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create staff
    const staff = await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      role,
      subRole,
      isVerified: true,
    });

    return res.status(201).json({
      message: "Staff account created.",
      staff,
    });
  } catch (error) {
    console.error("Create Staff Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

export const getAllStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: { $ne: "customer" } }).sort({
      createdAt: -1,
    });
    return res.json({ staff });
  } catch (error) {
    console.error("Get All Staff Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

export const updateStaffRole = async (req, res) => {
  try {
    const { staffId, role, subRole } = req.body;

    const staff = await User.findById(staffId);
    if (!staff)
      return res.status(404).json({ message: "Staff not found." });

    staff.role = role;
    staff.subRole = subRole;

    await staff.save();

    return res.json({ message: "Staff role updated.", staff });
  } catch (error) {
    console.error("Update Staff Role Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ message: "Staff deleted." });
  } catch (error) {
    console.error("Delete Staff Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

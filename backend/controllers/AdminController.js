// controllers/AdminController.js

import Shipment from "../models/Shipment.js";
import Transaction from "../models/Transaction.js";
import StaffActivity from "../models/StaffActivity.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalShipments = await Shipment.countDocuments();
    const totalUsers = await User.countDocuments({ role: "customer" });
    const totalStaff = await User.countDocuments({ role: { $ne: "customer" } });

    const delivered = await Shipment.countDocuments({ status: "delivered" });

    return res.json({
      totalShipments,
      totalUsers,
      totalStaff,
      delivered,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

export const getRevenueReport = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });

    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);

    return res.json({
      totalRevenue,
      transactions,
    });
  } catch (error) {
    console.error("Revenue Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

export const getShipmentAnalytics = async (req, res) => {
  try {
    const shipments = await Shipment.find().sort({ createdAt: -1 });

    return res.json({ shipments });
  } catch (error) {
    console.error("Shipment Analytics Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

export const getStaffActivityLogs = async (req, res) => {
  try {
    const logs = await StaffActivity.find().sort({ createdAt: -1 });

    return res.json({ logs });
  } catch (error) {
    console.error("Staff Activity Logs Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

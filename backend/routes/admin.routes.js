import express from "express";
import * as AdminController from "../controllers/AdminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ==========================
// Admin-only routes
// ==========================

// Dashboard (summary)
router.get("/dashboard", protect, adminOnly, AdminController.getDashboardStats);

// System analytics (legacy / alternative)
router.get("/stats", protect, adminOnly, AdminController.getDashboardStats);

// Revenue report
router.get("/revenue", protect, adminOnly, AdminController.getRevenueReport);

// Shipment volume analytics
router.get("/shipments", protect, adminOnly, AdminController.getShipmentAnalytics);

// Staff activity logs
router.get("/staff-activity", protect, adminOnly, AdminController.getStaffActivityLogs);

export default router;


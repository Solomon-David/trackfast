// routes/staff.routes.js

import express from "express";
import * as StaffActivityController from "../controllers/StaffActivityController.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Admin creates staff
router.post("/create", adminOnly, StaffActivityController.createStaff);

// Get all staff
router.get("/all", adminOnly, StaffActivityController.getAllStaff);

// Change staff role
router.post("/update-role", adminOnly, StaffActivityController.updateStaffRole);

// Delete staff
router.delete("/delete/:id", adminOnly, StaffActivityController.deleteStaff);

export default router;

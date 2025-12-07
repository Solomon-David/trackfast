import express from "express";
import * as TrackingController from "../controllers/TrackingEventController.js"; // Controller file can keep original name
import { protect } from "../middleware/authMiddleware.js";
import { staffOrAdmin, adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ==========================
// Staff/Admin routes
// ==========================
router.post("/", protect, staffOrAdmin, TrackingController.addTrackingEvent);
router.get("/:trackingNumber", protect, TrackingController.getEventsByTrackingNumber);
router.get("/", protect, adminOnly, TrackingController.getAllTrackingEvents);

export default router;

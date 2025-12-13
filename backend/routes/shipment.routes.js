import express from "express";
import * as ShipmentController from "../controllers/ShipmentController.js";
import * as TrackingController from "../controllers/TrackingEventController.js";
import { protect } from "../middleware/authMiddleware.js";
import { staffOrAdmin, adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ==========================
// Customer routes
// ==========================

// Create a new shipment
router.post("/create", protect, ShipmentController.createShipment);

router.post("/details", protect, ShipmentController.getShipmentByTrackingNumber);

// Get shipments of the logged-in user
router.get("/my-shipments", protect, ShipmentController.getMyShipments);

// ==========================
// Staff routes
// ==========================

// Get all shipments (staff or admin)
router.get("/all", protect, staffOrAdmin, ShipmentController.getAllShipments);

// Update shipment status
router.post("/update-status", protect, staffOrAdmin, TrackingController.addTrackingEvent);

// ==========================
// Admin routes
// ==========================

// Delete shipment by ID
router.delete("/delete/:trackingNumber", protect, staffOrAdmin, ShipmentController.deleteShipment);

router.post("/send-receipt", protect, staffOrAdmin, ShipmentController.sendReceiptEmail);

export default router;

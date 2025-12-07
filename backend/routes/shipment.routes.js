import express from "express";
import * as ShipmentController from "../controllers/ShipmentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { staffOrAdmin, adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ==========================
// Customer routes
// ==========================

// Create a new shipment
router.post("/create", protect, ShipmentController.createShipment);

// Get shipments of the logged-in user
router.get("/my-shipments", protect, ShipmentController.getMyShipments);

// ==========================
// Staff routes
// ==========================

// Get all shipments (staff or admin)
router.get("/all", protect, staffOrAdmin, ShipmentController.getAllShipments);

// Update shipment status
router.post("/update-status", protect, staffOrAdmin, ShipmentController.updateShipmentStatus);

// ==========================
// Admin routes
// ==========================

// Delete shipment by ID
router.delete("/delete/:id", protect, adminOnly, ShipmentController.deleteShipment);

export default router;

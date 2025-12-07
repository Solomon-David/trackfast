// routes/pickup.routes.js

import express from "express";
import * as PickupController from "../controllers/PickupController.js";
import { protect } from "../middleware/authMiddleware.js";
import { staffOnly, adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Customers
router.post("/request", protect, PickupController.requestPickup);
router.get("/my-pickups", protect, PickupController.getMyPickups);

// Staff
router.get("/all", staffOnly, PickupController.getAllPickups);
router.post("/update-status", staffOnly, PickupController.updatePickupStatus);

// Admin
router.delete("/delete/:id", adminOnly, PickupController.deletePickup);
export default router;

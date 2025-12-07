import express from "express";
import * as TransactionController from "../controllers/TransactionController.js";
import { protect } from "../middleware/authMiddleware.js";
import { staffOrAdmin, adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ==========================
// Customer routes
// ==========================
router.post("/create", protect, TransactionController.createTransaction);
router.get("/my-transactions", protect, TransactionController.getMyTransactions);

// ==========================
// Staff/Admin routes
// ==========================
router.get("/", protect, staffOrAdmin, TransactionController.getAllTransactions);

// ==========================
// Admin routes
// ==========================
router.delete("/:id", protect, adminOnly, TransactionController.deleteTransaction);

export default router;

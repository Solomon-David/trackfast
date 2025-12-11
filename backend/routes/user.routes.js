// backend/routes/user.routes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {  adminOnly } from "../middleware/roleMiddleware.js";
import * as UserController from "../controllers/UserController.js";

const router = express.Router();

// Public routes
router.post("/register", UserController.register);
router.post("/login", UserController.login);

// Protected routes
router.get("/profile", protect, UserController.getProfile);

router.post("/contact", protect, UserController.contactUs);

// // Admin-only routes
// router.get("/", protect, adminOnly, UserController.getAllUsers);

export default router;

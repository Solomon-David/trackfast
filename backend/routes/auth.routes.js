import express from "express";
import * as UserController from "../controllers/UserController.js"; // login & register
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================
// Authentication
// ==========================
router.post("/login", UserController.login);
router.post("/register", UserController.register);
router.post("/verify-account", UserController.verifyAccount);


// Optional: logout route
router.post("/logout", protect, UserController.logout);

export default router;

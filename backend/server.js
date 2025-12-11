import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Routes
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import shipmentRoutes from "./routes/shipment.routes.js";
import pickupRoutes from "./routes/pickup.routes.js";
import staffActivityRoutes from "./routes/staffActivity.routes.js";
import trackingRoutes from "./routes/tracking.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import pricingRoutes from "./routes/pricingsetting.routes.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// ==========================
// Global Middleware
// ==========================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================
// Routes
// ==========================
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/pickups", pickupRoutes);
app.use("/api/staff-activities", staffActivityRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/pricing", pricingRoutes);

// ==========================
// Health Check Endpoint
// ==========================
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "API is running" });
});

// ==========================
// Error handling middleware
// ==========================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

// ==========================
// MongoDB Connection
// ==========================
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

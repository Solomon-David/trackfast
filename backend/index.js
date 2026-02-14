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
import { ensureAdmin } from "./controllers/UserController.js";

//pricing model
import Pricing from "./models/PricingSettings.js";

//configure
dotenv.config();

// Load environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

console.log("mongo", MONGO_URI);

// Initialize Express app
const app = express();

// ==========================
// Global Middleware
// ==========================
app.use(cors());
app.use(express.json({limit: "10mb"}));
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


mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

// Ensure a pricing object always exists
(async function ensurePricingExists() {
  try {
    const count = await Pricing.countDocuments();

    if (count === 0) {
      console.log("⚠️ No pricing document found. Creating default pricing...");

      await Pricing.create({});

      console.log("✅ Default pricing document created.");
    } else {
      console.log("✔ Pricing document already exists.");
    }
  } catch (err) {
    console.error("❌ Failed to ensure pricing exists:", err);
  }
})();

  ensureAdmin();  

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

import mongoose from "mongoose";

const PricingSettingsSchema = new mongoose.Schema({
  basePrice: { type: Number, default: 1000 },          // flat rate
  pricePerKg: { type: Number, default: 250 },          // weight cost
  pricePerKm: { type: Number, default: 30 },           // distance cost
  volumetricDivisor: { type: Number, default: 5000 },  // L*W*H / divisor
  minimumPrice: { type: Number, default: 1500 },

  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("PricingSettings", PricingSettingsSchema);

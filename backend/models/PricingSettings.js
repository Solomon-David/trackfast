import mongoose from "mongoose";

const PricingSettingsSchema = new mongoose.Schema({
  basePrice: { type: Number, default: 1000 },          // flat rate
  pricePerKg: { type: Number, default: 250 },          // weight cost
  pricePerKm: { type: Number, default: 30 },           // distance cost
  volumetricDivisor: { type: Number, default: 500 },  // L*W*H / divisor
  insuranceFee: { type: Number, default: 100}


});

export default mongoose.model("PricingSettings", PricingSettingsSchema);

import mongoose from "mongoose";

const pickupSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    address: { type: String, required: true },
    date: { type: Date, required: true },

    packageDetails: {
      weight: Number,
      description: String,
    },

    status: {
      type: String,
      enum: ["requested", "scheduled", "picked-up", "cancelled"],
      default: "requested",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Pickup", pickupSchema);

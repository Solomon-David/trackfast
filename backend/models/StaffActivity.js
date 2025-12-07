import mongoose from "mongoose";

const staffActivitySchema = new mongoose.Schema(
  {
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: { type: String, required: true },
    shipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipment",
    },
    details: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("StaffActivity", staffActivitySchema);

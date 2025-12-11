import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    shipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipment",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },

  receiptImage: {
  type: String,   // base64 string
  required: true,
},
  },

  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);

import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema(
  {
    trackingNumber: { type: String, required: true, unique: true },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sender: {
      name: String,
      address: String,
      phone: String,
    },

    receiver: {
      name: String,
      address: String,
      phone: String,
    },

    package: {
      weight: Number,
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
      },
      description: String,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "received",
        "in-transit",
        "out-for-delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    currentLocation: { type: String, default: "Warehouse" },

    price: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Shipment", shipmentSchema);

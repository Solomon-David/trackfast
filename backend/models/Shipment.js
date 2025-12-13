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
      email: String, 
    },

    receiver: {
      name: String,
      address: String,
      email: String, 
    },

    package: {
      weight: Number,
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
      },
      description: String,
      senderCity: String,
      receiverCity: String,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "received",
        "in-transit",
        "out-for-delivery",
        "delivered",
        "cancelled"
      ],
      default: "pending",
    },

    currentLocation: { type: String, },

    cost: Number,

    deliveryDate: { type: Date},

  },
  { timestamps: true }
);

export default mongoose.model("Shipment", shipmentSchema);

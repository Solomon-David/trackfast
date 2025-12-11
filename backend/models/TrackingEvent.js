import mongoose from "mongoose";

const trackingEventSchema = new mongoose.Schema(
  {
    shipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipment",
      required: true,
    },

    trackingNumber: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "received",
        "in-transit",
        "out-for-delivery",
        "delivered",
      ],
      required: true,
    },

    location: String,
    message: String,

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("TrackingEvent", trackingEventSchema);

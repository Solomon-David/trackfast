// controllers/ShipmentController.js

import Shipment from "../models/Shipment.js";
import TrackingEvent from "../models/TrackingEvent.js";
import User from "../models/User.js";
import { emailQueue } from "../queues/emailQueue.js";
import { generateTrackingNumber } from "../utils/generateTrackingNumber.js";

// Create a new shipment
export const createShipment = async (req, res) => {
  try {
    const { senderId, receiverEmail, weight, dimensions } = req.body;
    const trackingNumber = generateTrackingNumber();

    const shipment = await Shipment.create({
      sender: senderId,
      receiverEmail,
      weight,
      dimensions,
      trackingNumber,
      status: "Pending",
    });

    // Queue email notification to receiver
    await emailQueue.add("sendEmail", {
      to: receiverEmail,
      subject: `Your shipment has been created`,
      text: `Your shipment #${trackingNumber} has been registered.`,
      html: `<p>Your shipment <strong>#${trackingNumber}</strong> has been registered.</p>`,
    });

    return res.json({ message: "Shipment created", shipment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find({ senderId: req.user.id }).sort({
      createdAt: -1,
    });
    return res.json({ shipments });
  } catch (error) {
    console.error("Get My Shipments Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

export const getAllShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find().sort({ createdAt: -1 });
    return res.json({ shipments });
  } catch (error) {
    console.error("Get All Shipments Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

export const updateShipmentStatus = async (req, res) => {
  try {
    const { trackingNumber, status } = req.body;

    const shipment = await Shipment.findOne({ trackingNumber });
    if (!shipment) return res.status(404).json({ message: "Shipment not found" });

    shipment.status = status;
    await shipment.save();

    // Queue email notification to receiver
    await emailQueue.add("sendEmail", {
      to: shipment.receiverEmail,
      subject: `Shipment Status Update`,
      text: `Your shipment #${trackingNumber} is now ${status}.`,
      html: `<p>Your shipment <strong>#${trackingNumber}</strong> is now <strong>${status}</strong>.</p>`,
    });

    res.json({ message: "Shipment status updated", shipment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteShipment = async (req, res) => {
  try {
    await Shipment.findByIdAndDelete(req.params.id);
    return res.json({ message: "Shipment deleted." });
  } catch (error) {
    console.error("Delete Shipment Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

// controllers/PickupController.js

import Pickup from "../models/Pickup.js";
import { emailQueue } from "../queues/emailQueue.js";
import { generateTrackingNumber } from "../utils/generateTrackingNumber.js";

//Scheduling pickup request

// Schedule a new pickup
export const schedulePickup = async (req, res) => {
  try {
    const { senderId, receiverEmail, pickupDate, address } = req.body;

    const pickup = await Pickup.create({
      sender: senderId,
      receiverEmail,
      pickupDate,
      address,
      status: "Scheduled",
      trackingNumber: generateTrackingNumber(),
    });

    // Queue email to receiver
    await emailQueue.add("sendEmail", {
      to: receiverEmail,
      subject: `Pickup Scheduled`,
      text: `Your pickup #${pickup.trackingNumber} is scheduled for ${pickupDate}.`,
      html: `<p>Your pickup <strong>#${pickup.trackingNumber}</strong> is scheduled for <strong>${pickupDate}</strong>.</p>`,
    });

    res.json({ message: "Pickup scheduled", pickup });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const requestPickup = async (req, res) => {
  try {
    const { address, packageDetails, preferredDate } = req.body;

    const pickup = await Pickup.create({
      userId: req.user.id,
      address,
      packageDetails,
      preferredDate,
      status: "pending",
    });

    return res.status(201).json({
      message: "Pickup request submitted.",
      pickup,
    });
  } catch (error) {
    console.error("Request Pickup Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

export const getMyPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    return res.json({ pickups });
  } catch (error) {
    console.error("Get My Pickups Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

export const getAllPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find().sort({ createdAt: -1 });
    return res.json({ pickups });
  } catch (error) {
    console.error("Get All Pickups Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};


// Update pickup status
export const updatePickupStatus = async (req, res) => {
  try {
    const { trackingNumber, status } = req.body;

    const pickup = await Pickup.findOne({ trackingNumber });
    if (!pickup) return res.status(404).json({ message: "Pickup not found" });

    pickup.status = status;
    await pickup.save();

    // Queue email notification
    await emailQueue.add("sendEmail", {
      to: pickup.receiverEmail,
      subject: `Pickup Status Update`,
      text: `Your pickup #${trackingNumber} is now ${status}.`,
      html: `<p>Your pickup <strong>#${trackingNumber}</strong> is now <strong>${status}</strong>.</p>`,
    });

    res.json({ message: "Pickup status updated", pickup });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePickup = async (req, res) => {
  try {
    await Pickup.findByIdAndDelete(req.params.id);
    return res.json({ message: "Pickup deleted." });
  } catch (error) {
    console.error("Delete Pickup Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

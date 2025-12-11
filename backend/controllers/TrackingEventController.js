// controllers/TrackingEventController.js

import TrackingEvent from "../models/TrackingEvent.js";
import Shipment from "../models/Shipment.js";
import { emailQueue } from "../queues/emailQueue.js";

export const trackPackage = async (req, res) => {
  try {
    const { trackingNumber } = req.params;

    const shipment = await Shipment.findOne({ trackingNumber });

    if (!shipment)
      return res.status(404).json({ message: "Invalid tracking number." });

    const events = await TrackingEvent.find({ trackingNumber }).sort({
      createdAt: -1,
    });

    return res.json({ shipment, events });
  } catch (error) {
    console.error("Track Package Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

// Add a new tracking event
export const addTrackingEvent = async (req, res) => {
  try {
    const { trackingNumber, status, currentLocation } = req.body;
    const shipment = await Shipment.findOne({ trackingNumber });
    if (!shipment) {
      console.log("no such shipment");
       return res.status(404).json({ message: "Shipment not found" });
      }

    const event = await TrackingEvent.create({
      shipment: shipment._id,
      trackingNumber,
      status,
      location: currentLocation,
      updatedBy: req.user.id,
      timestamp: new Date(),
    });
    
    shipment.currentLocation = currentLocation;
    shipment.status = status;
    await shipment.save();

    // Queue email to receiver
    await emailQueue.add("sendEmail", {
      to: shipment.receiverEmail,
      subject: `Shipment Update: ${status}`,
      text: `Your shipment ${trackingNumber} is ${status}.`,
      html: `<p>Your shipment <strong>#${trackingNumber}</strong> is now <strong>${status}</strong> at ${currentLocation}</p>`,
    });

    await event.save();    
    
    res.json({ message: "Tracking event added", success: true});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Get all tracking events for a specific shipment
 * @route   GET /api/tracking/:trackingNumber
 * @access  Protected (customer or staff)
 */
export const getEventsByTrackingNumber = async (req, res) => {
  const { trackingNumber } = req.params;

  try {
    const events = await TrackingEvent.find({ trackingNumber }).sort({ createdAt: 1 });

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No tracking events found for this shipment." });
    }

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching tracking events:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Get all tracking events (admin only)
 * @route   GET /api/tracking
 * @access  Admin
 */
export const getAllTrackingEvents = async (req, res) => {
  try {
    const events = await TrackingEvent.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching all tracking events:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// controllers/ShipmentController.js

import Shipment from "../models/Shipment.js";
import TrackingEvent from "../models/TrackingEvent.js";
import User from "../models/User.js";
// import { emailQueue } from "../queues/emailQueue.js";
import { generateTrackingNumber } from "../utils/generateTrackingNumber.js";
import sendEmail from '../utils/sendEmail.js';

// Create a new shipment
export const createShipment = async (req, res) => {
  try {
    
    const trackingNumber = generateTrackingNumber();

    // Build shipment payload matching the Shipment schema
    const shipmentPayload = {
      trackingNumber,
      status: "pending", // lowercase to match enum
      // link shipment to authenticated user as customer
      customer: req.user?.id,
      //sender subdocument 
      ...req.body,
      currentLocation: `${req.body.package.senderCity}, ${req.body.package.senderCountry}`
    };

    const shipment = await Shipment.create(shipmentPayload);

    // Fetch user email to send confirmation
    const user = await User.findById(req.user.id);
    const userEmail = user?.email;

    // Send confirmation email to sender
    if (userEmail) {
      await sendEmail({
        to: userEmail,
        subject: `Shipment Ready #${trackingNumber}`,
        text: `Your shipment is ready for delivery. Tracking number: ${trackingNumber}
               Visit ${process.env.FRONTEND_URL || "Trackfast"} for more details.`
      });
    }

    // Send notification email to receiver
    if (req.body.receiver?.email) {
      await sendEmail({
        to: req.body.receiver.email,
        subject: `Package on the Way #${trackingNumber}`,
        text: `A package is being sent to you by ${req.body.sender.name}.
               Tracking number: ${trackingNumber}. Visit ${process.env.FRONTEND_URL | "Trackfast"} for more details.`
      });
    }
    
    
     //create tracking event 
      await TrackingEvent.create({
        shipment: shipment._id,
        trackingNumber: shipment.trackingNumber,
        status: "pending",
        location: shipment.currentLocation,
        description: "Shipment created and awaiting pickup."
      });
      
      res.json({ message: "Shipment created", shipment });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const sendReceiptEmail = async (req, res) => {
  try {
    console.log("sending email");
    const { image, email, trackingNumber, message } = req.body;
    console.log(image, email, trackingNumber);
    await sendEmail( {
      to: email,
      subject: `Receipt for Shipment #${trackingNumber}`, 
      text: message,
      attachments: [
        {
          filename: `receipt_${trackingNumber}.png`,
          content: image.split("base64,")[1],
          encoding: "base64",
        },
      ],
    });
    res.json({ message: "Receipt email sent successfully." });
  } catch (error) {
    console.error("Send Receipt Email Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find({ customer: req.user.id }).sort({
      createdAt: -1,
    });
    return res.json(shipments);
  } catch (error) {
    console.error("Get My Shipments Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

export const getAllShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find().sort({ createdAt: -1 });
    return res.json( shipments );
  } catch (error) {
    console.error("Get All Shipments Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

export const updateShipmentStatus = async (req, res) => {
  try {
    const { trackingNumber, status, currentLocation, deliveryDate } = req.body;
console.log("Update Shipment Status Request:", req.body);
    const shipment = await Shipment.findOne({ trackingNumber });
    if (!shipment) return res.status(404).json({ message: "Shipment not found" });

    const oldStatus = shipment.status;
    const oldLocation = shipment.currentLocation;
    shipment.status = status;
    if (currentLocation) {
      shipment.currentLocation = currentLocation;
    }

    if (deliveryDate) {
      shipment.deliveryDate = deliveryDate;
    }

    if  (status=="delivered") {
      shipment.currentLocation = shipment.package.receiverCity;
    }
    await shipment.save();

    // Fetch customer (user) email to send notification
    const customer = await User.findById(shipment.customer);
    const customerEmail = customer?.email;

    // Build a detailed status update email
    if (customerEmail) {
      const statusMessages = {
        pending: "Your shipment is pending and awaiting pickup.",
        received: "Your shipment has been received at our facility.",
        "in-transit": "Your shipment is on its way to the destination. It should be delivered on ${{ shipment.deliveryDate ? shipment.deliveryDate.toDateString() : 'soon' }}.",
        "out-for-delivery": "Your shipment is out for delivery today.",
        delivered: "Your package is ready for pickup! ",
        cancelled: "Your shipment has been cancelled.",
      };

      const statusMessage = statusMessages[status?.toLowerCase()] || `Your shipment status has been updated to ${status}.`;
      
      // Queue email notification to customer
      await sendEmail( {
      to: email,
      subject: `Receipt for Shipment #${trackingNumber}`, 
      text: message,
      attachments: [
        {
          filename: `receipt_${trackingNumber}.png`,
          content: image.split("base64,")[1],
          encoding: "base64",
        },
      ],
    });
    }

    res.json({ message: "Shipment status updated", shipment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteShipment = async (req, res) => {
  try {
    console.log("deleting")
    await Shipment.deleteOne({trackingNumber:req.params.trackingNumber});
    return res.json({ message: "Shipment deleted." });
  } catch (error) {
    console.error("Delete Shipment Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

export const getShipmentByTrackingNumber = async (req, res) => {
  try {
    const { trackingNumber } = req.body;
    const shipment = await Shipment.findOne({ trackingNumber }).populate('customer', 'name email');
    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found." });
    }
    return res.json(shipment);
  } catch (error) {
    console.error("Get Shipment By Tracking Number Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};
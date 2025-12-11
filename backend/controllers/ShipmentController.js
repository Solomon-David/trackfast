// controllers/ShipmentController.js

import Shipment from "../models/Shipment.js";
import TrackingEvent from "../models/TrackingEvent.js";
import User from "../models/User.js";
import { emailQueue } from "../queues/emailQueue.js";
import { generateTrackingNumber } from "../utils/generateTrackingNumber.js";
import { createTransaction } from "../controllers/TransactionController.js"

// Create a new shipment
export const createShipment = async (req, res) => {
  try {
    const {
      senderName,
      senderAddress,
      senderEmail,
      receiverName,
      receiverAddress,
      receiverEmail,
      weight,
      dimensionLength,
      dimensionWidth,
      dimensionHeight,
      description,
      amount
    } = req.body;
    const trackingNumber = generateTrackingNumber();

    // Build shipment payload matching the Shipment schema
    const shipmentPayload = {
      trackingNumber,
      status: "pending", // lowercase to match enum
      // link shipment to authenticated user as customer
      customer: req.user?.id,
      //sender subdocument 
      sender: {
        name: senderName,
        address: senderAddress,
        email: senderEmail,
      },      
      // receiver subdocument with name, address, phone
      receiver: {
        name: receiverName,
        address: receiverAddress,
        email: receiverEmail,
      },
      // package subdocument with weight, dimensions object, description
      package: {
        weight,
        dimensions: {
          length: dimensionLength,
          width: dimensionWidth,
          height: dimensionHeight,
        },
        description,
      },
    };

    const shipment = await Shipment.create(shipmentPayload);

    // Fetch user email to send confirmation
    const user = await User.findById(req.user.id);
    const userEmail = user?.email;

    // Build a summary email
    if (userEmail) {
      const emailBody = `
        <h2>Shipment Created Successfully</h2>
        <p>Dear ${senderName},</p>
        <p>Your shipment has been registered in the TrackFast system.</p>
        <hr />
        <h3>Shipment Summary</h3>
        <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
        <p><strong>Status:</strong> ${shipment.status}</p>
        <h4>Sender Information</h4>
        <ul>
          <li><strong>Name:</strong> ${senderName}</li>
          <li><strong>Address:</strong> ${senderAddress}</li>
          <li><strong>Email:</strong> ${senderEmail}</li>
        </ul>
        <h4>Receiver Information</h4>
        <ul>
          <li><strong>Name:</strong> ${receiverName}</li>
          <li><strong>Address:</strong> ${receiverAddress}</li>
          <li><strong>Email:</strong> ${receiverEmail}</li>
        </ul>
        <h4>Package Details</h4>
        <ul>
          <li><strong>Weight:</strong> ${weight} kg</li>
          <li><strong>Dimensions:</strong> ${dimensionLength}L × ${dimensionWidth}W × ${dimensionHeight}H cm</li>
          ${description ? `<li><strong>Description:</strong> ${description}</li>` : ""}
        </ul>
        <hr />
        <p>You can track your shipment using tracking number: <strong>${trackingNumber}</strong></p>
        <p>Thank you for using TrackFast!</p>
      `;

      // Queue email notification to user
      await emailQueue.add("sendEmail", {
        to: userEmail,
        subject: `Shipment Created - Tracking #${trackingNumber}`,
        html: emailBody,
      });
    }

    await createTransaction({amount, customer: req.user.id, shipment: shipment.id});
    return res.json({ message: "Shipment created", shipment });
  } catch (err) {
    console.error(err);
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
    return res.json({ shipments });
  } catch (error) {
    console.error("Get All Shipments Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

export const updateShipmentStatus = async (req, res) => {
  try {
    const { trackingNumber, status, currentLocation } = req.body;

    const shipment = await Shipment.findOne({ trackingNumber });
    if (!shipment) return res.status(404).json({ message: "Shipment not found" });

    const oldStatus = shipment.status;
    const oldLocation = shipment.currentLocation;
    shipment.status = status;
    if (currentLocation) {
      shipment.currentLocation = currentLocation;
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
        "in-transit": "Your shipment is on its way to the destination.",
        "out-for-delivery": "Your shipment is out for delivery today.",
        delivered: "Your shipment has been successfully delivered!",
        cancelled: "Your shipment has been cancelled.",
      };

      const statusMessage = statusMessages[status?.toLowerCase()] || `Your shipment status has been updated to ${status}.`;

      const emailBody = `
        <h2>Shipment Status Update</h2>
        <p>Dear ${shipment.sender?.name || "Valued Customer"},</p>
        <p>${statusMessage}</p>
        <hr />
        <h3>Shipment Details</h3>
        <ul>
          <li><strong>Tracking Number:</strong> ${trackingNumber}</li>
          <li><strong>Previous Status:</strong> ${oldStatus}</li>
          <li><strong>Current Status:</strong> ${status}</li>
          ${oldLocation !== shipment.currentLocation ? `<li><strong>Previous Location:</strong> ${oldLocation}</li>` : ""}
          <li><strong>Current Location:</strong> ${shipment.currentLocation || "In Transit"}</li>
        </ul>
        <h4>Receiver Information</h4>
        <ul>
          <li><strong>Name:</strong> ${shipment.receiver?.name || "N/A"}</li>
          <li><strong>Address:</strong> ${shipment.receiver?.address || "N/A"}</li>
        </ul>
        <h4>Package Details</h4>
        <ul>
          <li><strong>Weight:</strong> ${shipment.package?.weight || "N/A"} kg</li>
          <li><strong>Dimensions:</strong> ${shipment.package?.dimensions ? `${shipment.package.dimensions.length}L × ${shipment.package.dimensions.width}W × ${shipment.package.dimensions.height}H cm` : "N/A"}</li>
          ${shipment.package?.description ? `<li><strong>Description:</strong> ${shipment.package.description}</li>` : ""}
        </ul>
        <hr />
        <p>For more details, you can track your shipment at any time using tracking number: <strong>${trackingNumber}</strong></p>
        <p>Thank you for using TrackFast!</p>
      `;

      // Queue email notification to customer
      await emailQueue.add("sendEmail", {
        to: customerEmail,
        subject: `Shipment Status Updated: ${status.toUpperCase()} - Tracking #${trackingNumber}`,
        html: emailBody,
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
    await Shipment.findByIdAndDelete(req.params.id);
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
import Transaction from "../models/Transaction.js";
import Shipment from "../models/Shipment.js";
import sendEmail from "../utils/sendEmail.js";

/**
 * @desc    Create a transaction using tracking number + base64 receipt image
 * @route   POST /api/transactions
 * @access  Staff/Admin
 */
export const createTransaction = async (req, res) => {
  try {
    const { trackingNumber, amount, customerEmail, receiptBase64 } = req.body;

    if (!trackingNumber || !amount || !customerEmail || !receiptBase64) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // 1) Find shipment
    const shipment = await Shipment.findOne({ trackingNumber });

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found." });
    }

    // 2) Create transaction document (store Base64 string)
    const transaction = await Transaction.create({
      amount,
      customer: shipment.customer,
      shipment: shipment._id,
      receiptImage: receiptBase64,   // <--- stored directly
    });

    // 3) Send email with inline base64 image
    await sendEmail({
      to: customerEmail,
      subject: "Your Shipment Receipt",
      html: `
        <p>Your receipt for shipment <strong>${trackingNumber}</strong> is below:</p>
        <br/>
        <img 
          src="${receiptBase64}" 
          alt="Receipt Image" 
          style="max-width: 100%; border:1px solid #ccc; border-radius:8px;"
        />
      `,
    });

    res.status(201).json({
      message: "Transaction created and emailed successfully.",
      transaction,
    });

  } catch (error) {
    console.error("Create Transaction Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * @desc    Get all transactions
 * @route   GET /api/transactions
 * @access  Admin/Staff
 */
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("customer", "fullName email")
      .populate("shipment", "trackingNumber status");

    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * @desc    Get logged-in user's transactions
 * @route   GET /api/transactions/my-transactions
 * @access  Customer
 */
export const getMyTransactions = async (req, res) => {
  try {
    const userId = req.user._id;

    const transactions = await Transaction.find({ customer: userId })
      .sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Get My Transactions Error:", error);
    res.status(500).json({ message: "Server error." });
  }
};


/**
 * @desc    Delete a transaction
 * @route   DELETE /api/transactions/:id
 * @access  Admin
 */
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found." });
    }

    await transaction.deleteOne();

    res.status(200).json({ message: "Transaction deleted successfully." });
  } catch (error) {
    console.error("Delete Transaction Error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

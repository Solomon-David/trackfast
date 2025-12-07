import Transaction from "../models/Transaction.js";

// Create a transaction
export const createTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(201).json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all transactions
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
 * @desc    Get all transactions belonging to the logged-in user
 * @route   GET /api/transactions/my-transactions
 * @access  Protected (customers)
 */
export const getMyTransactions = async (req, res) => {
  try {
    const userId = req.user._id;

    const transactions = await Transaction.find({ user: userId })
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Get My Transactions Error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

/**
 * @desc    Delete a transaction (admin only)
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


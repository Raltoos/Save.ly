const User = require("../models/userModel");

const getUserProfile = async (req, res) => {
  try {
    // Ensure that req.user exists (it should be set by your protect middleware)
    if (!req.user) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized: User information not provided",
      });
    }

    // Find the user by ID and exclude the password field
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User profile retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    res.status(500).json({
      status: "fail",
      message: "Server error while retrieving user profile",
    });
  }
};

const getTransactions = async (req, res) => {
  try {
    res.status(200).json(req.user.transactions);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).send("Failed to fetch transactions");
  }
};

const addTransaction = async (req, res) => {
  try {
    const {
      id,
      transaction_title,
      amount,
      category,
      savingOption,
      savingAmount,
      date,
    } = req.body;

    const newTx = {
      id,
      transaction_title,
      amount,
      category,
      savingOption,
      savingAmount,
      date,
    };

    req.user.transactions.push(newTx);
    await req.user.save();

    res.status(201).json(req.user.transactions);
  } catch (err) {
    console.error("Error adding transaction:", err);
    res.status(500).send("Failed to add transaction");
  }
};

module.exports = { getUserProfile, getTransactions, addTransaction };

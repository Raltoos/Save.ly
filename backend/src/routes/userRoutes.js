const express = require("express");
const { getUserProfile, getTransactions, addTransaction } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// Protected route to get user profile
router.route("/profile").get(protect, getUserProfile);
router
  .route("/transactions")
  .get(protect, getTransactions)
  .post(protect, addTransaction);

module.exports = router;

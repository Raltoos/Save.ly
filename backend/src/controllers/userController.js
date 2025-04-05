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

module.exports = { getUserProfile };

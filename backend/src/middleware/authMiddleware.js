const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the authorization header exists and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "No token provided, authorization denied",
    });
  }

  const token = authHeader.split(" ")[1]; // Extract token from the header

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found, authorization denied",
      });
    }

    // Attach user object to request
    req.user = user;

    next(); // Proceed to the next middleware/controller
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token, authorization denied",
    });
  }
};

module.exports = { protect };

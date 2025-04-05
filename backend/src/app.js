const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const WebSocket = require("ws");
const connectDB = require("./config/db");
// const speechServiceRoutes = require("./routes/speechServiceRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config(); // Load environment variables

// Connect to MongoDB
connectDB();

// Initialize the Express app
const app = express();
app.use(express.urlencoded({ extended: true })); // Add this line

// Middleware to parse incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

// Define application routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/users", userRoutes); // User-related routes

// Health Check Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error for debugging
  res.status(500).json({
    success: false,
    message: "An internal server error occurred.",
    error: err.message,
  });
});

// 404 Handler for Undefined Routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Export the app for use in server.js
module.exports = app;

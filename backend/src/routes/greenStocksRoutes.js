const express = require("express");
const { getGreenStocks, getPersonalizedTips } = require("../controllers/greenStocksController");
const router = express.Router();

// GET /api/greenstocks - Fetch green stocks using the OpenAI API
router.get("/green-stocks", getGreenStocks);
router.post("/personalized-tips", getPersonalizedTips); // <-- new route

module.exports = router;

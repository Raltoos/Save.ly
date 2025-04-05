const express = require("express");
const { getGreenStocks } = require("../controllers/greenStocksController");
const router = express.Router();

// GET /api/greenstocks - Fetch green stocks using the OpenAI API
router.get("/", getGreenStocks);

module.exports = router;

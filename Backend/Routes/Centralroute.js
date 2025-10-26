// centralRoutes.js
const express = require("express");
const { transaction } = require("../Controllers/centralController");

const router = express.Router();

// Route to approve and process interbank transaction
router.post("/central/transaction", transaction);

module.exports = router;


// centralroute.js
const express = require("express");
const { transaction, centralSys } = require("../Controllers/centralController");

const router = express.Router();

// Route to display interbank transaction requests with proceed buttons
router.get("/central", centralSys);

// Route to approve and process interbank transaction (POST)
router.post("/transaction", transaction);

module.exports = router;

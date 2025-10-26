const express = require("express");
const { transferWithinBank, transferOut } = require("../Controllers/transactionController");

const router = express.Router();

router.post("/transfer", transferWithinBank);

// Route for interbank transfers
router.post("/transfer/other", transferOut);

module.exports = router;

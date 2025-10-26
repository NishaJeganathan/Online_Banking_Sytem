const express = require("express");
const { transferWithinBank } = require("../Controllers/transactionController");

const router = express.Router();

router.post("/transfer", transferWithinBank);

module.exports = router;

const express = require("express");
const {
  transferWithinBank,
  transferOut,
} = require("../Controllers/transactionController");

const router = express.Router();
const userController = require("../Controllers/userController");

// register
router.post("/register/:bankId", userController.registerUser);

// 🔹 Login a user for a specific bank
router.post("/:bankId/login", userController.loginUser);

// 🔹 Get user info (protected route)
router.get("/:bankId/me", userController.getUserInfo);

//transfer within bank
router.post("/transfer", transferWithinBank);

// Route for interbank transfers
router.post("/transfer/other", transferOut);

module.exports = router;

const express = require("express");
const {
  transferWithinBank,
  transferOut,
} = require("../Controllers/transactionController");

const router = express.Router();
const userController = require("../Controllers/userController");
const middleware = require("../Middleware/userMiddleware");

// register
router.post("/register", middleware.verifyToken, userController.registerUser);

// login
router.post("/login", middleware.verifyToken, userController.loginUser);

//transfer within bank
router.post("/transfer", transferWithinBank);

// Route for interbank transfers
router.post("/transfer/other", transferOut);

module.exports = router;

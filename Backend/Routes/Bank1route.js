const express = require("express");
const router = express.Router();
const accountController = require("../Controllers/accountController"); 

// ✅ Fetch all accounts of logged-in user (uses JWT)
router.get("/:bankId/accounts", accountController.getUserAccounts);

// ✅ Fetch details of a specific account (only if it belongs to logged-in user)
router.get("/:bankId/accounts/:acc_no", accountController.getAccountDetails);

// ✅ Fetch balance of a specific account
router.get("/:bankId/accounts/:acc_no/balance", accountController.getAccountBalance);

router.get("/:bankId/accounts/:acc_no/transactions", accountController.getTransactionHistory);


module.exports = router;

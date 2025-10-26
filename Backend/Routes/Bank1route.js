const express = require("express");
<<<<<<< HEAD
const router = express.Router();
const accountController = require("../Controllers/accountController"); 

// ✅ Fetch all accounts of logged-in user (uses JWT)
router.get("/:bankId/accounts", accountController.getUserAccounts);

// ✅ Fetch details of a specific account (only if it belongs to logged-in user)
router.get("/:bankId/accounts/:acc_no", accountController.getAccountDetails);

// ✅ Fetch balance of a specific account
router.get("/:bankId/accounts/:acc_no/balance", accountController.getAccountBalance);

router.get("/:bankId/accounts/:acc_no/transactions", accountController.getTransactionHistory);

=======
const { transferWithinBank } = require("../Controllers/transactionController");

const router = express.Router();

router.post("/transfer", transferWithinBank);
>>>>>>> 6afefc0168b2d77eb8e9f24bbb4a6ffe6848d994

module.exports = router;

const express = require("express");
const {
  transferWithinBank,
  transferOut,
} = require("../Controllers/transactionController");

const userController = require("../Controllers/userController");

const router = express.Router();

// Navigation HTML snippet to insert in pages
const navLinks = `
<nav>
  <a href="/api/bank/register/bank2">Register</a> |
  <a href="/api/bank/bank2/login">Login</a> |
  <a href="/api/bank/transfer">Transfer Within Bank</a> |
  <a href="/api/bank/transfer/other">Interbank Transfer</a>
</nav>
<hr/>
`;

// --------- FRONTEND PAGES (GET) ---------

// Registration page form for a given bankId
router.get("/register/:bankId", (req, res) => {
  const { bankId } = req.params;
  res.send(`
    ${navLinks}
    <h2>Register User - Bank: ${bankId}</h2>
    <form method="POST" action="/api/bank/register/${bankId}">
      <input name="username" placeholder="Username" required /><br/>
      <input name="password" type="password" placeholder="Password" required /><br/>
      <input name="acc_no" placeholder="Account Number" /><br/>
      <input name="mobile" placeholder="Mobile" /><br/>
      <input name="age" placeholder="Age" type="number" /><br/>
      <input name="gender" placeholder="Gender" /><br/>
      <button type="submit">Register</button>
    </form>
  `);
});

// Login page form for a given bankId
router.get("/:bankId/login", (req, res) => {
  const { bankId } = req.params;
  res.send(`
    ${navLinks}
    <h2>Login User - Bank: ${bankId}</h2>
    <form method="POST" action="/api/bank/${bankId}/login">
      <input name="username" placeholder="Username" required /><br/>
      <input name="password" type="password" placeholder="Password" required /><br/>
      <button type="submit">Login</button>
    </form>
  `);
});

// Transfer Within Bank form page
router.get("/transfer", (req, res) => {
  res.send(`
    ${navLinks}
    <h2>Transfer Within Bank</h2>
    <form method="POST" action="/api/bank/transfer">
      <input name="bankId" placeholder="Bank ID (e.g. bank2)" required /><br/>
      <input name="senderAccNo" placeholder="Sender Account Number" required /><br/>
      <input name="receiverAccNo" placeholder="Receiver Account Number" required /><br/>
      <input name="amount" type="number" step="0.01" placeholder="Amount" required /><br/>
      <button type="submit">Transfer</button>
    </form>
  `);
});

// Interbank Transfer form page
router.get("/transfer/other", (req, res) => {
  res.send(`
    ${navLinks}
    <h2>Interbank Transfer</h2>
    <form method="POST" action="/api/bank/transfer/other">
      <input name="sender_bank_id" placeholder="Sender Bank ID" required /><br/>
      <input name="sender_acc" placeholder="Sender Account Number" required /><br/>
      <input name="receiver_bank_id" placeholder="Receiver Bank ID" required /><br/>
      <input name="receiver_acc" placeholder="Receiver Account Number" required /><br/>
      <input name="amount" type="number" step="0.01" placeholder="Amount" required /><br/>
      <button type="submit">Transfer</button>
    </form>
  `);
});

// --------- API ROUTES (POST) ---------

// Register user
router.post("/register/:bankId", userController.registerUser);

// Login user
router.post("/:bankId/login", userController.loginUser);

// Get user info (expects userId as query param, e.g. /:bankId/me?userId=...)
router.get("/:bankId/me", userController.getUserInfo);

// Transfer within bank
router.post("/transfer", transferWithinBank);

// Interbank transfer
router.post("/transfer/other", transferOut);

module.exports = router;

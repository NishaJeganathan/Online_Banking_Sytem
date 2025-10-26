// centralController.js
const fs = require("fs").promises;
const path = require("path");
const TransactionModel = require("../Models/transactionModel");
const AccountModel = require("../Models/accountModel");
const { getBankDB } = require("../config/db");

const REQUESTS_FILE = path.join(__dirname, "../data/interbank_requests.json");

async function transaction(req, res) {
  const { req_id } = req.body; // Only one input

  try {
    const fileContent = await fs.readFile(REQUESTS_FILE, "utf8");
    const requests = JSON.parse(fileContent);

    const request = requests.find((r) => r.req_id === parseInt(req_id));
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const {
      sender_bank_id,
      receiver_bank_id,
      sender_acc,
      receiver_acc,
      transaction_id_sender,
      amount,
    } = request;

    const receiverAccount = await AccountModel.getAccountByAccNo(
      receiver_bank_id,
      receiver_acc
    );
    if (!receiverAccount) {
      return res
        .status(404)
        .json({ message: "Receiver account not found in receiver bank" });
    }

    const newReceiverBalance =
      parseFloat(receiverAccount.current_balance) + parseFloat(amount);
    await TransactionModel.updateBalance(
      receiver_bank_id,
      receiver_acc,
      newReceiverBalance
    );

    // ...
    await TransactionModel.recordTransactionHistory({
    bank_id: sender_bank_id,
    acc_no:  sender_acc,
    recv_bank: receiver_bank_id,
    recv_acc_no:receiver_acc,
    amount: amount,
    status: "completed",
    });
// ...

    // 5. Update sender’s transaction entry to 'completed'
    const senderDB = getBankDB(sender_bank_id);
    const updateSenderStatusQuery =
      "UPDATE transaction_history SET status = ? WHERE id = ?";
    await senderDB.query(updateSenderStatusQuery, ["completed", transaction_id_sender]);

    // 6. Update JSON file to reflect 'completed' status
    const requestIndex = requests.findIndex(
      (r) => r.req_id === parseInt(req_id)
    );
    requests[requestIndex].status = "completed";
    await fs.writeFile(REQUESTS_FILE, JSON.stringify(requests, null, 2));

    // 7. Return final success response
    res.status(200).json({
      message: "Interbank transaction processed successfully",
      receiver_bank_id,
      receiver_acc,
      credited_amount: amount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Transaction processing failed",
      error: error.message,
    });
  }
}

module.exports = { transaction };

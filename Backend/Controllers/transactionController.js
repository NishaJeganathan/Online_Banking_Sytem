const TransactionModel = require("../Models/transactionModel");
const AccountModel = require("../Models/accountModel");
const { getBankDB } = require("../config/db");
const fs = require("fs").promises;
const path = require("path");

const DATA_DIR = path.join(__dirname, "../data");
const REQUESTS_FILE = path.join(DATA_DIR, "interbank_requests.json");

async function transferWithinBank(req, res) {
  const { bankId, senderAccNo, receiverAccNo, amount } = req.body;

  const db = getBankDB(bankId);
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const senderAccount = await AccountModel.getAccountByAccNo(
      bankId,
      senderAccNo
    );
    if (!senderAccount) {
      return res.status(404).json({ message: "Invalid sender account number" });
    }

    const receiverAccount = await AccountModel.getAccountByAccNo(
      bankId,
      receiverAccNo
    );
    if (!receiverAccount) {
      return res
        .status(404)
        .json({ message: "Invalid receiver account number" });
    }

    const senderCurrentBalance = parseFloat(senderAccount.current_balance);
    const receiverCurrentBalance = parseFloat(receiverAccount.current_balance);
    const amountNum = parseFloat(amount);

    const senderNewBalance = senderCurrentBalance - amountNum;
    const receiverNewBalance = receiverCurrentBalance + amountNum;

    if (senderNewBalance < 0) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    await TransactionModel.updateBalance(
      bankId,
      receiverAccNo,
      receiverNewBalance,
      connection
    );
    await TransactionModel.updateBalance(
      bankId,
      senderAccNo,
      senderNewBalance,
      connection
    );
    await TransactionModel.recordTransaction(
      bankId,
      bankId,
      senderAccNo,
      receiverAccNo,
      amountNum,
      "completed",
      connection
    );
    await connection.commit();
    res.status(200).json({ message: "Transfer successful" });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: "Transfer failed", error: error.message });
  } finally {
    connection.release();
  }
}

async function transferOut(req, res) {
  const { sender_bank_id, sender_acc, receiver_bank_id, receiver_acc, amount } =
    req.body;

  try {
    const senderAccount = await AccountModel.getAccountByAccNo(
      sender_bank_id,
      sender_acc
    );
    if (!senderAccount) {
      return res.status(404).json({ message: "Invalid sender account" });
    }
    if (parseFloat(senderAccount.current_balance) < parseFloat(amount)) {
      return res.status(400).json({ message: "Insufficient funds" });
    }
    const newBalance =
      parseFloat(senderAccount.current_balance) - parseFloat(amount);
    await TransactionModel.updateBalance(
      sender_bank_id,
      sender_acc,
      newBalance
    );
    const stringified = JSON.stringify(req.sender_bank_id);
    console.log(stringified);
    const transactionIdSender = await TransactionModel.recordTransactionHistory(
      {
        bank_id: sender_bank_id,
        sender_bank: sender_bank_id,
        acc_no: sender_acc,
        recv_bank: receiver_bank_id,
        recv_acc_no: receiver_acc,
        amount,
        status: "pending",
      }
    );
    const newRequest = {
      req_id: Date.now(),
      transaction_id_sender: transactionIdSender,
      sender_bank_id,
      sender_acc,
      receiver_bank_id,
      receiver_acc,
      amount,
      status: "pending",
      timestamp: new Date().toISOString(),
    };

    await fs.mkdir(DATA_DIR, { recursive: true });
    let requests = [];
    try {
      const fileContent = await fs.readFile(REQUESTS_FILE, "utf8");
      requests = JSON.parse(fileContent);
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
      requests = [];
    }

    requests.push(newRequest);
    await fs.writeFile(REQUESTS_FILE, JSON.stringify(requests, null, 2));

    res.status(200).json({
      message:
        "Transfer request recorded and amount deducted. Pending admin approval.",
      request_id: newRequest.req_id,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Transfer request failed", error: error.message });
  }
}

module.exports = { transferWithinBank, transferOut };

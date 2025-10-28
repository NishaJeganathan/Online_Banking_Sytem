const { bank1DB, bank2DB, bank3DB, getBankDB } = require("../config/db");

const TransactionModel = {
  async updateBalance(bankId, acc_no, newAmount, connection = null) {
    const db = getBankDB(bankId);
    const query = "UPDATE accounts SET current_balance = ? WHERE acc_no = ?";
    if (connection) {
      await connection.query(query, [newAmount, acc_no]);
    } else {
      await db.query(query, [newAmount, acc_no]);
    }
  },

  async recordTransactionHistory({
    bank_id,
    sender_bank,
    acc_no,
    recv_bank,
    recv_acc_no,
    amount,
    status,
  }) {
    const db = getBankDB(bank_id);
    const query = `
      INSERT INTO transactions (sender_bank, acc_no, recv_bank, recv_acc_no, amount, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      sender_bank,
      acc_no,
      recv_bank,
      recv_acc_no,
      amount,
      status,
    ]);
    return result.insertId;
  },
  async updateTransactionStatus({ bankId, transactionId, status }) {
    const db = getBankDB(bankId);
    const query = `
          UPDATE transactions
          SET status = ?
          WHERE transaction_id = ?
      `;
    console.log(transactionId);
    console.log("checkpoint 4.1");
    await db.query(query, [status, transactionId]);
    console.log("checkpoint 4.2");
  },
  async recordTransaction(
    bankId,
    sender_bank,
    senderAcc,
    receiverAcc,
    amount,
    status,
    connection = null
  ) {
    const db = getBankDB(bankId);
    const query = `
      INSERT INTO transactions (sender_bank, acc_no, recv_bank, recv_acc_no, amount, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    if (connection) {
      await connection.query(query, [
        sender_bank,
        senderAcc,
        bankId, // assuming within bank transfer, receiver bank is same as sender bank
        receiverAcc,
        amount,
        status,
      ]);
    } else {
      await db.query(query, [
        bankId,
        senderAcc,
        bankId,
        receiverAcc,
        amount,
        status,
      ]);
    }
  },
  // Updates the status of a transaction in the specified bank's transaction_history table
};

module.exports = TransactionModel;

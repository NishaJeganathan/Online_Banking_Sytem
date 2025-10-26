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

  // Updated: recordTransactionHistory now inserts explicitly sender_bank
  async recordTransactionHistory({ bank_id, acc_no, recv_bank, recv_acc_no, amount, status }) {
    const db = getBankDB(bank_id);
    const query = `
      INSERT INTO transactions (sender_bank, acc_no, recv_bank, recv_acc_no, amount, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      bank_id,     // sender_bank = bank_id passed
      acc_no,
      recv_bank,
      recv_acc_no,
      amount,
      status,
    ]);
    return result.insertId; // transaction_id_sender
  },

  async recordTransaction(bankId, senderAcc, receiverAcc, amount, status, connection = null) {
    const db = getBankDB(bankId);
    const query = `
      INSERT INTO transactions (sender_bank, acc_no, recv_bank, recv_acc_no, amount, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    if (connection) {
      await connection.query(query, [
        bankId,       // sender_bank = bankId here
        senderAcc,
        bankId,       // assuming within bank transfer, receiver bank is same as sender bank
        receiverAcc,
        amount,
        status,
      ]);
    } else {
      await db.query(query, [bankId, senderAcc, bankId, receiverAcc, amount, status]);
    }
  },
};

module.exports = TransactionModel;

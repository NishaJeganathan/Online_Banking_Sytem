const { getBankDB } = require('../config/db');

const Account={
  async getAccountsByUser(bankId,user_id){
    const db=getBankDB(bankId);
    const [rows] = await db.query(
      "SELECT acc_no, acc_type, current_balance, min_balance, interest FROM accounts WHERE user_id = ?",
      [user_id]
    );
    return rows;
  },
   async getAccountByAccNo(bankId, acc_no) {
    const db = getBankDB(bankId);
    const [rows] = await db.query(
      "SELECT acc_no, user_id, acc_type, current_balance, min_balance, interest FROM accounts WHERE acc_no = ?",
      [acc_no]
    );
    return rows[0];
  },
  async getBalance(bankId, acc_no) {
    const db = getBankDB(bankId);
    const [rows] = await db.query(
      "SELECT acc_no, current_balance FROM accounts WHERE acc_no = ?",
      [acc_no]
    );
    return rows[0];
  },

  async getAllTransactions(bankId,acc_no){
    const db=getbankDB(bankId);
    const [sent]=await db.query("SELECT transaction_id,recv_bank,recv_acc_no,amount,timestamp,status FROM transactions WHERE acc_no=? and sender_bank=? ORDER BY timestamp DESC",[acc_no,bankId]);

    const [received]=await db.query("SELECT transaction_id,sender_bank,acc_no AS sender_account,amount,timestamp,status FROM transactions WHERE recv_acc_no=? and recv_bank=? ORDER BY timestamp DESC",[acc_no,bankId]);
    return {sent,received};
  },
};

module.exports=Account;

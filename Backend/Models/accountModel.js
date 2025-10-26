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
    const [sent]=await db.query("SELECT transaction_id,acc_no AS sender_acc_no,recv_bank,recv_acc_no,amount,timestamp,status FROM transactions WHERE acc_no=? ORDER BY timestamp DESC",[acc_no]);

    const [received]=await db.query("SELECT transaction_id,acc_no AS receive_acc_no,recv_bank AS sender_bank,RECV_acc_no AS sender_acc_no,amount,timestamp,status FROM transactions WHERE recv_acc_no=? ORDER BY timestamp DESC",[acc_no]);
    return {sent,received};
  },
};

module.exports=Account;

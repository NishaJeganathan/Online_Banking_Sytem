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
};

module.exports=Account;

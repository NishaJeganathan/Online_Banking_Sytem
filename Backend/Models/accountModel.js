const pool=require("../config/db");

function getbankDB(bankId){
  if(bankId=="bank1") return bank1DB;
  if (bankId === "bank2") return bank2DB;
  if (bankId === "bank3") return bank3DB;
  throw new Error("Invalid bank ID");
}

const Account={
  async getAccountsByUser(bankId,user_id){
    const db=getbankDB(bankId);
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

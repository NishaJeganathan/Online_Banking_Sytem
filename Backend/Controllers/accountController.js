// const Account = require("../Models/accountModel");

// exports.getUserAccounts = async (req, res) => {
//   try {
//     const { bankId } = req.params;
//     const userId = req.user.id;

//     const accounts = await Account.getAccountsByUser(bankId, userId);
//     res.status(200).json(accounts);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch user accounts" });
//   }
// };
// exports.getAccountDetails = async (req, res) => {
//   try {
//     const { bankId, acc_no } = req.params;
//     const account = await Account.getAccountByAccNo(bankId, acc_no);

//     if (!account) return res.status(404).json({ message: "Account not found" });
//     if (account.user_id !== req.user.id)
//       return res.status(403).json({ message: "Unauthorized access" });

//     res.status(200).json(account);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch account details" });
//   }
// };

// exports.getAccountBalance = async (req, res) => {
//   try {
//     const { bankId, acc_no } = req.params;
//     const balance = await Account.getBalance(bankId, acc_no);

//     if (!balance)
//       return res.status(404).json({ message: "Account not found" });

//     res.status(200).json({
//       acc_no: balance.acc_no,
//       balance: balance.current_balance,
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch account balance" });
//   }
// };

// exports.getTransactionHistory=async(req,res)=>{
//   try{
//     const {bankId,acc_no}=req.params;
//     const account=await Account.getAccountByAccNo(bankId,acc_no);

//     if(!account) return res.status(404).json({message:"Account not found"});

//     if(account.user_id!==req.user.id) return res.status(403).json({message:"Unauthorized access"});

//     const transactions=await Account.getAllTransactions(bankId,acc_no);
//     res.status(200).json(transactions);
//   } catch(error){
//     console.error("Error fetching transaction history:",error);
//     res.status(500).json({error:"Failed to fetch transaction history"});
//   }
// };

const Account = require("../Models/accountModel");

exports.getUserAccounts = async (req, res) => {
  try {
    const { bankId } = req.params;
    const userId = req.user.id;

    const accounts = await Account.getAccountsByUser(bankId, userId);
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user accounts" });
  }
};
exports.getAccountDetails = async (req, res) => {
  try {
    const { bankId, acc_no } = req.params;
    const account = await Account.getAccountByAccNo(bankId, acc_no);

    if (!account) return res.status(404).json({ message: "Account not found" });
    if (account.user_id !== req.user.id)
      return res.status(403).json({ message: "Unauthorized access" });

    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch account details" });
  }
};

exports.getAccountBalance = async (req, res) => {
  try {
    const { bankId, acc_no } = req.params;
    const balance = await Account.getBalance(bankId, acc_no);

    if (!balance) return res.status(404).json({ message: "Account not found" });

    res.status(200).json({
      acc_no: balance.acc_no,
      balance: balance.current_balance,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch account balance" });
  }
};

exports.getTransactionHistory = async (req, res) => {
  try {
    const { bankId, acc_no, userId } = req.body;

    const account = await Account.getAccountByAccNo(bankId, acc_no);

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (String(account.user_id) !== String(userId)) {
      return res
        .status(403)
        .json({ message: "Unauthorized access to this account" });
    }

    const transactions = await Account.getAllTransactions(bankId, acc_no);
    if (!transactions || transactions.length === 0) {
      return res
        .status(404)
        .json({ message: "No transactions found for this account" });
    }

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    res.status(500).json({ error: "Failed to fetch transaction history" });
  }
};

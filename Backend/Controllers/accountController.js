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

    if (!balance)
      return res.status(404).json({ message: "Account not found" });

    res.status(200).json({
      acc_no: balance.acc_no,
      balance: balance.current_balance,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch account balance" });
  }
};


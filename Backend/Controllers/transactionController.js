const TransactionModel = require('../Models/transactionModel');
const AccountModel = require('../Models/accountModel');
const { getBankDB } = require('../config/db'); // path may need adjustment

async function transferWithinBank(req, res) {
  const { bankId, senderAccNo, receiverAccNo, amount } = req.body;

  const db = getBankDB(bankId);
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const senderAccount = await AccountModel.getAccountByAccNo(bankId, senderAccNo);
    if (!senderAccount) {
      return res.status(404).json({ message: 'Invalid sender account number' });
    }

    const receiverAccount = await AccountModel.getAccountByAccNo(bankId, receiverAccNo);
    if (!receiverAccount) {
      return res.status(404).json({ message: 'Invalid receiver account number' });
    }

    const senderCurrentBalance = senderAccount.current_balance;
    const receiverCurrentBalance = receiverAccount.current_balance;
    const senderNewBalance = senderCurrentBalance - amount;

    if (senderNewBalance < 0) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const receiverNewBalance = receiverCurrentBalance + amount;

    await TransactionModel.updateBalance(bankId, senderAccNo, senderNewBalance, connection);
    await TransactionModel.updateBalance(bankId, receiverAccNo, receiverNewBalance, connection);
    await TransactionModel.recordTransaction(bankId, senderAccNo, receiverAccNo, amount, 'completed', connection);

    await connection.commit();

    res.status(200).json({ message: 'Transfer successful' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Transfer failed', error: error.message });
  } finally {
    connection.release();
  }
}

module.exports = { transferWithinBank };

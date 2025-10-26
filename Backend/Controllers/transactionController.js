const TransactionModel = require("../Models/transactionModel");
const AccountModel = require("../Models/accountModel");
const { getBankDB } = require("../config/db");
const centralController = require("./centralController");

async function transferWithinBank(req, res) {
  const { bankId, senderAccNo, receiverAccNo, amount } = req.body;

  const db = getBankDB(bankId);
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const senderAccount = await AccountModel.getAccountByAccNo(bankId, senderAccNo);
    if (!senderAccount) {
      return res.status(404).json({ message: "Invalid sender account number" });
    }

    const receiverAccount = await AccountModel.getAccountByAccNo(bankId, receiverAccNo);
    if (!receiverAccount) {
      return res.status(404).json({ message: "Invalid receiver account number" });
    }

    const senderCurrentBalance = parseFloat(senderAccount.current_balance);
    const receiverCurrentBalance = parseFloat(receiverAccount.current_balance);
    const amountNum = parseFloat(amount);

    const senderNewBalance = senderCurrentBalance - amountNum;
    const receiverNewBalance = receiverCurrentBalance + amountNum;

    if (senderNewBalance < 0) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    await TransactionModel.updateBalance(bankId, receiverAccNo, receiverNewBalance, connection);
    await TransactionModel.updateBalance(bankId, senderAccNo, senderNewBalance, connection);
    await TransactionModel.recordTransaction(bankId, senderAccNo, receiverAccNo, amountNum, "completed", connection);

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
  const { sender_bank_id, receiver_bank_id, sender_acc, receiver_acc, amount } = req.body;

  try {
    await TransactionModel.recordTransaction(sender_bank_id, sender_acc, receiver_acc, amount, 'pending');
    const transactionSuccess = await centralController.transaction(
      sender_bank_id,
      receiver_bank_id,
      sender_acc,
      receiver_acc,
      amount
    );

    if (transactionSuccess) {
      await TransactionModel.updateTransactionStatus(sender_bank_id, sender_acc, receiver_acc, amount, 'completed');
      res.status(200).json({ message: 'Interbank transfer completed successfully' });
    } else {
      await TransactionModel.updateTransactionStatus(sender_bank_id, sender_acc, receiver_acc, amount, 'failed');
      res.status(500).json({ message: 'Interbank transfer failed during recipient update' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Transfer failed', error: error.message });
  }
}

module.exports = { transferWithinBank, transferOut };

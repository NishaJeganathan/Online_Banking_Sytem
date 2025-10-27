// centralController.js
const fs = require("fs").promises;
const path = require("path");
const TransactionModel = require("../Models/transactionModel");
const AccountModel = require("../Models/accountModel");
const { getBankDB } = require("../config/db");

const REQUESTS_FILE = path.join(__dirname, "../data/interbank_requests.json");

// Renders the requests list with proceed buttons and client-side transaction script
async function centralSys(req, res) {
  try {
    const fileContent = await fs.readFile(REQUESTS_FILE, "utf8");
    const requests = JSON.parse(fileContent);

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Requests List</title>
        <style>
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
          button { padding: 6px 12px; }
        </style>
      </head>
      <body>
        <h1>Interbank Requests</h1>
        <table>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Sender Bank</th>
              <th>Receiver Bank</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
    `;

    for (const r of requests) {
      html += `
        <tr>
          <td>${r.req_id}</td>
          <td>${r.sender_bank_id}</td>
          <td>${r.receiver_bank_id}</td>
          <td>${r.amount}</td>
          <td>${r.status}</td>
          <td>
            ${
              r.status !== "completed"
                ? `<button onclick="transaction(${r.req_id})">Proceed</button>`
                : "Completed"
            }
          </td>
        </tr>
      `;
    }

    html += `
          </tbody>
        </table>

        <script>
          async function transaction(req_id) {
            if (!confirm('Are you sure you want to proceed with request ID ' + req_id + '?')) {
              return;
            }
            
            try {
              const response = await fetch('/admin/transaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ req_id })
              });
              const result = await response.json();
              if (response.ok) {
                alert(result.message);
                location.reload(); // Refresh to update the UI with status changes
              } else {
                alert('Error: ' + result.message);
              }
            } catch (error) {
              alert('Transaction failed: ' + error.message);
            }
          }
        </script>

      </body>
      </html>
    `;

    res.send(html);
  } catch (error) {
    res.status(500).send("Error loading requests: " + error.message);
  }
}

// Processes transaction request from client
async function transaction(req, res) {
  const { req_id } = req.body;

  try {
    const fileContent = await fs.readFile(REQUESTS_FILE, "utf8");
    const requests = JSON.parse(fileContent);

    const request = requests.find((r) => r.req_id === parseInt(req_id));
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const {
      sender_bank_id,
      receiver_bank_id,
      sender_acc,
      receiver_acc,
      transaction_id_sender,
      amount,
      status,
    } = request;

    if (status === "completed") {
      return res.status(400).json({ message: "Transaction already completed" });
    }
    console.log("Checkpoint1");
    // Check receiver account existence
    const receiverAccount = await AccountModel.getAccountByAccNo(
      receiver_bank_id,
      receiver_acc
    );
    if (!receiverAccount) {
      return res
        .status(404)
        .json({ message: "Receiver account not found in receiver bank" });
    }
    console.log("checkpoint 2");
    // Calculate new receiver balance and update
    const newReceiverBalance =
      parseFloat(receiverAccount.current_balance) + parseFloat(amount);
    await TransactionModel.updateBalance(
      receiver_bank_id,
      receiver_acc,
      newReceiverBalance
    );
    console.log("checkpoint 3");
    // Record transaction history for sender
    await TransactionModel.recordTransactionHistory({
      bank_id: receiver_bank_id,
      sender_bank:sender_bank_id,
      acc_no: sender_acc,
      recv_bank: receiver_bank_id,
      recv_acc_no: receiver_acc,
      amount: amount,
      status: "completed",
    });

    console.log("checkpoint 4");
    // Update sender's transaction status in DB
    await TransactionModel.updateTransactionStatus(
        sender_bank_id,
        transaction_id_sender,
        "completed"
    );
    console.log("checkpoint 5");
    // Update JSON request status and overwrite file
    const requestIndex = requests.findIndex((r) => r.req_id === parseInt(req_id));
    requests[requestIndex].status = "completed";
    await fs.writeFile(REQUESTS_FILE, JSON.stringify(requests, null, 2));

    // Send success response
    res.status(200).json({
      message: "Interbank transaction processed successfully",
      receiver_bank_id,
      receiver_acc,
      credited_amount: amount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Transaction processing failed",
      error: error.message,
    });
  }
}

module.exports = { centralSys, transaction };

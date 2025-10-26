import { useEffect, useState } from "react";
import axios from "axios";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/transactions", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setTransactions(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">To/From</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.id} className="border-b">
              <td className="px-4 py-2">{new Date(tx.date).toLocaleString()}</td>
              <td className="px-4 py-2">{tx.type}</td>
              <td className="px-4 py-2">₹{tx.amount}</td>
              <td className="px-4 py-2">{tx.counterparty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

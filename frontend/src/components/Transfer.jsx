import { useState } from "react";
import axios from "axios";

export default function Transfer() {
  const [form, setForm] = useState({ to: "", amount: "" });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/transfer", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert("Transfer successful!");
      setForm({ to: "", amount: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Transfer failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Transfer Money</h2>
        <input name="to" placeholder="Recipient Email" onChange={handleChange} value={form.to} className="w-full p-2 border mb-2 rounded"/>
        <input name="amount" placeholder="Amount" type="number" onChange={handleChange} value={form.amount} className="w-full p-2 border mb-4 rounded"/>
        <button className="w-full bg-green-600 text-white p-2 rounded">Send</button>
      </form>
    </div>
  );
}

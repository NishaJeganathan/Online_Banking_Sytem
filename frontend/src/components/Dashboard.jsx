import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/account", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setAccount(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  if (!account) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Account Overview</h2>
      <p><strong>Name:</strong> {account.name}</p>
      <p><strong>Email:</strong> {account.email}</p>
      <p><strong>Balance:</strong> ₹{account.balance}</p>
    </div>
  );
}

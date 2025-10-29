require("dotenv").config();
const express = require("express");
const cors = require("cors");  //

const db = require("./config/db");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "*", // You can restrict this later, e.g. ["http://localhost:3000"]
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Basic test route
app.get("/", (req, res) => {
  res.status(200).send("Online Banking System API is Running!");
});

// Routes
const Bank1route = require("./Routes/Bank1route"); 
const Bank2route = require("./Routes/Bank2route"); 
const Bank3route = require("./Routes/Bank3route"); 
const Central = require("./Routes/Centralroute");

app.use("/api/b1", Bank1route);
app.use("/api/b2", Bank2route);
app.use("/api/b3", Bank3route);
app.use("/admin", Central);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log(`Access at http://localhost:${PORT}`);
});

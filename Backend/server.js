require('dotenv').config();
const express = require('express');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
  res.status(200).send('Online Banking System API is Running!');
});

// Import your Bank1 route that contains transfer route
const Bank1route = require('./Routes/Bank1route');  // adjust path if needed

// Use Bank1 routes on '/bank1'
app.use('/bank1', Bank1route);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log(`Access at http://localhost:${PORT}`);
});

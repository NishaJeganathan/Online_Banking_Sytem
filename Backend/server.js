// server.js

// Load environment variables for PORT and other configs
require('dotenv').config(); 
const express = require('express');

// The database connection file. Importing it runs the connection check.
const db = require('./Backend/config/db'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup (we will add more here later, like JSON parsing)
app.use(express.json());

// Basic Route for testing
app.get('/', (req, res) => {
  res.status(200).send('Online Banking System API is Running!');
});

// You will add routes here later, e.g.:
// app.use('/api/users', require('./Backend/Controllers/userController')); 
// app.use('/api/transactions', require('./Backend/Controllers/transactionController'));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log(`Access at http://localhost:${PORT}`);
});
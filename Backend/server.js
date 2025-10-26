require('dotenv').config();
const express = require('express');


const db = require('./config/db'); 

const app = express();
const PORT = process.env.PORT || 5000;
const accountRoutes = require('./Routes/Bank1route');

app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
  res.status(200).send('Online Banking System API is Running!');
});


app.use('/api/users', require('./Controllers/userController')); 
app.use('/api/transactions', require('./Controllers/transactionController'));
app.use('/api/accounts', accountRoutes);
// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log(`Access at http://localhost:${PORT}`);
});

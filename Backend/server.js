require('dotenv').config();
const express = require('express');
<<<<<<< HEAD

// The database connection file. Importing it runs the connection check.
const db = require('./config/db'); 
=======
const db = require('./config/db');
>>>>>>> 6afefc0168b2d77eb8e9f24bbb4a6ffe6848d994

const app = express();
const PORT = process.env.PORT || 5000;
const accountRoutes = require('./Routes/Bank1route');

app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
  res.status(200).send('Online Banking System API is Running!');
});

<<<<<<< HEAD
// You will add routes here later, e.g.:
// app.use('/api/users', require('./Backend/Controllers/userController')); 
// app.use('/api/transactions', require('./Backend/Controllers/transactionController'));
app.use('/api/accounts', accountRoutes);
// Start the server
=======
// Import your Bank1 route that contains transfer route
const Bank1route = require('./Routes/Bank1route');  // adjust path if needed

// Use Bank1 routes on '/bank1'
app.use('/bank1', Bank1route);

>>>>>>> 6afefc0168b2d77eb8e9f24bbb4a6ffe6848d994
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log(`Access at http://localhost:${PORT}`);
});

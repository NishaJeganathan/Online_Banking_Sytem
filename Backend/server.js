require('dotenv').config();
const express = require('express');
<<<<<<< HEAD


const db = require('./config/db'); 
=======
const db = require('./config/db');
>>>>>>> 52d16133ef72f3bafb9883278455d44e7f13921c

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
  res.status(200).send('Online Banking System API is Running!');
});

<<<<<<< HEAD

app.use('/api/users', require('./Controllers/userController')); 
app.use('/api/transactions', require('./Controllers/transactionController'));
app.use('/api/accounts', accountRoutes);
// Start the server
=======
// Import your Bank1 route that contains transfer route
const Bank1route = require('./Routes/Bank1route');  // adjust path if needed

// Use Bank1 routes on '/bank1'
app.use('/bank1', Bank1route);

>>>>>>> 52d16133ef72f3bafb9883278455d44e7f13921c
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log(`Access at http://localhost:${PORT}`);
});

const mysql = require("mysql2/promise");

// Helper function to create connection pool for each bank
const createConnection = (database) => {
  return mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
};

// Create connections for each bank
const bank1DB = createConnection("bank1_db");
const bank2DB = createConnection("bank2_db");
const bank3DB = createConnection("bank3_db");

module.exports = {
  bank1DB,
  bank2DB,
  bank3DB,
};

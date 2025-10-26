CREATE DATABASE IF NOT EXISTS bank1_db;
CREATE DATABASE IF NOT EXISTS bank2_db;
CREATE DATABASE IF NOT EXISTS bank3_db;

USE bank1_db;

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  mobile VARCHAR(15),
  kyc_status VARCHAR(20) DEFAULT 'pending',
  age INT,
  gender ENUM('Male', 'Female', 'Other'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE accounts (
  acc_no BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  acc_type ENUM('savings', 'current', 'fixed') NOT NULL,
  min_balance DECIMAL(15,2) DEFAULT 1000.00,
  current_balance DECIMAL(15,2) DEFAULT 0.00,
  interest DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE transactions (
  transaction_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  acc_no BIGINT NOT NULL,
  recv_bank VARCHAR(50) NOT NULL,
  recv_acc_no BIGINT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  FOREIGN KEY (acc_no) REFERENCES accounts(acc_no)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);


USE bank2_db;

CREATE TABLE users LIKE bank1_db.users;
CREATE TABLE accounts LIKE bank1_db.accounts;
CREATE TABLE transactions LIKE bank1_db.transactions;

USE bank3_db;

CREATE TABLE users LIKE bank1_db.users;
CREATE TABLE accounts LIKE bank1_db.accounts;
CREATE TABLE transactions LIKE bank1_db.transactions;
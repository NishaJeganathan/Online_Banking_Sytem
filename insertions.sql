-- USERS (bank1_db.users)
INSERT INTO users (username, password, mobile, kyc_status, age, gender)
VALUES
  ('rohit_sharma',   'testpass1', '1111111111', 'approved', 32, 'Male'),
  ('priya_nair',     'testpass2', '2222222222', 'approved', 28, 'Female'),
  ('akash_verma',    'testpass3', '3333333333', 'approved', 36, 'Male'),
  ('simran_singh',   'testpass4', '4444444444', 'pending',  25, 'Female'),
  ('arjun_mehra',    'testpass5', '5555555555', 'approved', 41, 'Male');

-- ACCOUNTS (bank1_db.accounts)
-- Make sure user_id matches the auto-incremented IDs from the above insertions
INSERT INTO accounts (user_id, acc_type, min_balance, current_balance, interest)
VALUES
  (1, 'savings', 1000.00, 5000.00, 1.50),    -- acc_no will be '1234567890' if you manually set AUTO_INCREMENT
  (2, 'savings', 1000.00, 2000.00, 1.50),    -- acc_no will be '9876543210' if set accordingly
  (3, 'current', 1000.00, 8000.00, 0.00),
  (4, 'fixed',   1000.00, 12000.00, 4.25),
  (5, 'savings', 1000.00, 500.00, 1.50);

const User = require("../Models/userModel");
const accountModel = require("../Models/accountModel");
// 📝 Register User
exports.registerUser = async (req, res) => {
  try {
    const { bankId } = req.params;
    const { username, password, acc_no, mobile, age, gender } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findByUsername(bankId, username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Check if account exists
    console.log("Checking account for bankId:", bankId, "acc_no:", acc_no);
    const account = await accountModel.getAccountByAccNo(bankId, acc_no);
    console.log("Account found:", account);

    if (!account) {
      return res.status(400).json({ message: "Account does not exist" });
    }

    // Create user (no password hashing for now)
    const userId = await User.createUser(bankId, username, password, mobile, age, gender);

    // Link the new user with the account
    await accountModel.addAccountUserLink(bankId, acc_no, userId);

    res.status(201).json({
      message: `User registered successfully in ${bankId}`,
      userId,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "User registration failed" });
  }
};


exports.loginUser = async (req, res) => {
  try {
     const { bankId } = req.params;
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    const user = await User.findByUsername(bankId, username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Simple password comparison (⚠️ No bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: `Login successful in ${bankId}`,
      user: {
        user_id: user.user_id,
        username: user.username,
        mobile: user.mobile,
        age: user.age,
        gender: user.gender,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

// Get User Info
exports.getUserInfo = async (req, res) => {
  try {
    const { bankId } = req.params;
    const { userId } = req.query; // example: /api/bank/bank1/user?userId=5

    const user = await User.findById(bankId, userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ error: "Failed to fetch user info" });
  }
};

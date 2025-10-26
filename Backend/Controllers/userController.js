const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

exports.registerUser = async (req, res) => {
  try {
    const { bankId } = req.params;
    const { username, password, mobile, age, gender } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    const existingUser = await User.findByUsername(bankId, username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await User.createUser(bankId, username, hashedPassword, mobile, age, gender);

    res.status(201).json({
      message: "User registered successfully",
      userId,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "User registration failed" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { bankId } = req.params;
    const { username, password } = req.body;

    const user = await User.findByUsername(bankId, username);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.user_id, username: user.username, bankId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};
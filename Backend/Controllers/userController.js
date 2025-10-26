import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, getUserByEmail } from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Register user (Admin or Client)
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({ msg: "All fields required" });

    const existing = await getUserByEmail(email);
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const id = await createUser({ name, email, passwordHash, role });

    res.status(201).json({ msg: "User registered successfully", id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.role !== role)
      return res.status(403).json({ msg: "Invalid role for this user" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({
      msg: "Login successful",
      token,
      user: { id: user.id, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Profile (protected route)
export const getProfile = async (req, res) => {
  try {
    const { id, role } = req.user;
    const [rows] = await db.execute("SELECT id, name, email, role FROM users WHERE id = ?", [id]);
    res.json({ user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

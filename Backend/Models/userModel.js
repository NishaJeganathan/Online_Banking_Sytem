const { getBankDB } = require("../config/db");

const User = {
  async createUser(bankId, username, password, mobile, age, gender) {
    const db = getBankDB(bankId);
    const [result] = await db.query(
      "INSERT INTO users (username, password, mobile, age, gender) VALUES (?, ?, ?, ?, ?)",
      [username, password, mobile, age, gender]
    );
    return result.insertId;
  },

  async findByUsername(bankId, username) {
    const db = getBankDB(bankId);
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    return rows[0];
  },

  async findById(bankId, userId) {
    const db = getBankDB(bankId);
    const [rows] = await db.query("SELECT * FROM users WHERE user_id = ?", [userId]);
    return rows[0];
  },
};

module.exports = User;
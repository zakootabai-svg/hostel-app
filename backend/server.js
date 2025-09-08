const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const pool = require("./db");

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

// ----------------------
// Register new student
// ----------------------
app.post("/api/register", async (req, res) => {
  const { username, password, fullName, email } = req.body;
  try {
    const [existing] = await pool.query("SELECT * FROM students WHERE username = ?", [username]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    await pool.query(
      "INSERT INTO students (username, password, full_name, email) VALUES (?, ?, ?, ?)",
      [username, password, fullName, email]
    );

    res.json({ message: "Registration successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

// ----------------------
// Login student
// ----------------------
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM students WHERE username = ? AND password = ?", [
      username,
      password,
    ]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    res.json({
      message: "Login successful",
      user: {
        username: user.username,
        full_name: user.full_name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

// ----------------------
// Get student details
// ----------------------
app.get("/api/students/:username", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, username, full_name, email FROM students WHERE username = ?",
      [req.params.username]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Student not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

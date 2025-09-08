const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const pool = require("./db"); // mysql2/promise pool

dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5500",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// --- Health check ---
app.get("/", (req, res) => {
  res.send("✅ Backend is running");
});

// --- DB check ---
app.get("/db-check", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1+1 AS result");
    res.json({ db: "connected", result: rows[0].result });
  } catch (err) {
    res.status(500).json({ db: "error", error: err.message });
  }
});

// --- Register ---
app.post("/api/register", async (req, res) => {
  try {
    const { username, password, full_name } = req.body;

    if (!username || !password || !full_name) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const [result] = await pool.query(
      "INSERT INTO users (username, password_hash, full_name) VALUES (?, ?, ?)",
      [username, password, full_name]
    );

    res.json({ success: true, userId: result.insertId });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// --- Login ---
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE username = ? AND password_hash = ?",
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ success: true, user: rows[0] });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// --- Fetch students ---
app.get("/api/students", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    console.error("❌ Fetch students error:", err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// --- Start server ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

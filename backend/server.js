// server.js
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const pool = require("./db");
require("dotenv").config();

const app = express();

// ✅ Allow Netlify + Localhost
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:4000",
    "https://alfizaagirlshostel.netlify.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ✅ Health check
app.get("/", (req, res) => {
  res.send("✅ Backend is running");
});

// ==================== LOGIN ====================
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({
      token,
      user: {
        username: user.username,
        fullName: user.full_name
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ==================== REGISTER ====================
app.post("/api/register", async (req, res) => {
  try {
    const { username, password, full_name, email, room_number, start_date, end_date, fee } = req.body;

    await pool.query(
      "INSERT INTO users (username, password, full_name, email, room_number, start_date, end_date, fee) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [username, password, full_name, email, room_number, start_date, end_date, fee]
    );

    res.json({ message: "Student registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// ==================== VERIFY TOKEN MIDDLEWARE ====================
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
}

// ==================== STUDENT DASHBOARD ROUTE ====================
app.get("/api/students/:username", verifyToken, async (req, res) => {
  try {
    const { username } = req.params;

    const [rows] = await pool.query(
      "SELECT username, full_name, email, room_number, start_date, end_date, fee FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch student data" });
  }
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// frontend/config.js

// Detect environment: local (for dev) or production (Netlify + Render)
const API_BASE = location.hostname.includes("localhost")
  ? "http://localhost:4000"   // local backend
  : "https://hostel-app-vesi.onrender.com"; // Render backend

// Export API base so all fetch() calls use the correct URL
window.API_BASE = API_BASE;

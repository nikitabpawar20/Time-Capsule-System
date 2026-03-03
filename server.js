const express = require("express");
const path = require("path");
const messageRoutes = require("./routes/messageRoutes");
require("dotenv").config();

// Scheduler ko start karne ke liye
require("./config/scheduler"); 

const app = express();

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Static Files ---
// Isse tumhari HTML, CSS aur JS files browser ko milengi
app.use(express.static(path.join(__dirname, "public")));

// --- API Routes ---
// Sabhi backend calls "/messages" prefix ke saath hongi
app.use("/messages", messageRoutes);

// --- Home Route ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// --- 404 Handler ---
app.use((req, res, next) => {
  res.status(404).json({ error: "Sorry, ye route nahi mila!" });
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ 
    success: false, 
    error: "Internal Server Error",
    message: err.message 
  });
});

// --- Server Start ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  🚀 Time Capsule Server Running!
  --------------------------------
  Local: http://localhost:${PORT}
  Environment: ${process.env.NODE_ENV || 'development'}
  --------------------------------
  `);
});
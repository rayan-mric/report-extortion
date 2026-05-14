// server.js
// Entry point for the Express backend.
// Run with: node server.js  (or: npm run dev  using nodemon)

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const reportRoutes = require("./routes/reports");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────

// helmet adds security-related HTTP headers automatically
app.use(helmet());

// cors allows the React frontend (on a different port) to call this API
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PATCH"],
  })
);

// Parse incoming JSON request bodies
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────

// All report-related routes live under /api/reports
app.use("/api/reports", reportRoutes);

// Health check — useful for deployment platforms (Render, Railway, etc.)
app.get("/health", (req, res) => res.json({ status: "ok" }));

// ── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

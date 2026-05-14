// controllers/reportController.js
// Business logic lives here — routes just call these functions.
// Keeping logic separate from routes makes the code clean and testable.

const pool = require("../db/pool");
const { uploadToS3 } = require("../middleware/upload");

// ── POST /api/reports ────────────────────────────────────────────────────────
// Create a new incident report (with optional image/video upload to S3)
const createReport = async (req, res) => {
  try {
    const { title, description, police_station, address, city } = req.body;

    // Basic validation — these fields are required
    if (!title || !description || !address || !city) {
      return res.status(400).json({ error: "title, description, address and city are required" });
    }

    let image_url = null;
    let video_url = null;

    // If files were attached, upload each one to S3
    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        image_url = await uploadToS3(req.files.image[0]);
      }
      if (req.files.video && req.files.video[0]) {
        video_url = await uploadToS3(req.files.video[0]);
      }
    }

    // Insert into PostgreSQL and return the new row
    const result = await pool.query(
      `INSERT INTO reports (title, description, police_station, address, city, image_url, video_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, description, police_station, address, city, image_url, video_url]
    );

    res.status(201).json({
      message: "Report submitted successfully",
      report: result.rows[0],
    });
  } catch (err) {
    console.error("createReport error:", err);
    res.status(500).json({ error: "Server error while creating report" });
  }
};

// ── GET /api/reports ─────────────────────────────────────────────────────────
// Get all reports, with optional filters: ?city=Toronto&status=pending
const getReports = async (req, res) => {
  try {
    const { city, status } = req.query;

    // Dynamically build the WHERE clause based on query params
    const conditions = [];
    const values = [];

    if (city) {
      values.push(city);
      conditions.push(`LOWER(city) = LOWER($${values.length})`);
    }
    if (status) {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const result = await pool.query(
      `SELECT * FROM reports ${whereClause} ORDER BY created_at DESC`,
      values
    );

    res.json({ reports: result.rows, count: result.rowCount });
  } catch (err) {
    console.error("getReports error:", err);
    res.status(500).json({ error: "Server error while fetching reports" });
  }
};

// ── GET /api/reports/:id ─────────────────────────────────────────────────────
// Get a single report by ID
const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM reports WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json({ report: result.rows[0] });
  } catch (err) {
    console.error("getReportById error:", err);
    res.status(500).json({ error: "Server error while fetching report" });
  }
};

// ── PATCH /api/reports/:id/status ────────────────────────────────────────────
// Update a report's status (for admin use: pending → reviewed → resolved)
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "reviewed", "resolved"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${validStatuses.join(", ")}` });
    }

    const result = await pool.query(
      "UPDATE reports SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json({ message: "Status updated", report: result.rows[0] });
  } catch (err) {
    console.error("updateStatus error:", err);
    res.status(500).json({ error: "Server error while updating status" });
  }
};

module.exports = { createReport, getReports, getReportById, updateStatus };

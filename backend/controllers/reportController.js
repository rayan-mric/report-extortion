// controllers/reportController.js
// Business logic for creating and retrieving incident reports.

const pool = require("../db/pool");

const createReport = async (req, res) => {
  try {
    const { title, description, police_station, address, city } = req.body;

    if (!title?.trim() || !description?.trim() || !address?.trim() || !city?.trim()) {
      return res.status(400).json({
        error: "Title, description, address and city are required.",
      });
    }

    const result = await pool.query(
      `INSERT INTO reports (title, description, police_station, address, city)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, description, police_station, address, city, status, created_at`,
      [
        title.trim(),
        description.trim(),
        police_station?.trim() || null,
        address.trim(),
        city.trim(),
      ]
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

const getReports = async (req, res) => {
  try {
    const { city, status } = req.query;
    const conditions = [];
    const values = [];

    if (city?.trim()) {
      values.push(city.trim());
      conditions.push(`LOWER(city) = LOWER($${values.length})`);
    }

    if (status?.trim()) {
      const validStatuses = ["pending", "reviewed", "resolved"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status filter." });
      }
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const result = await pool.query(
      `SELECT id, title, description, police_station, address, city, status, created_at
       FROM reports ${whereClause}
       ORDER BY created_at DESC`,
      values
    );

    res.json({ reports: result.rows, count: result.rowCount });
  } catch (err) {
    console.error("getReports error:", err);
    res.status(500).json({ error: "Server error while fetching reports" });
  }
};

const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT id, title, description, police_station, address, city, status, created_at
       FROM reports WHERE id = $1`,
      [id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json({ report: result.rows[0] });
  } catch (err) {
    console.error("getReportById error:", err);
    res.status(500).json({ error: "Server error while fetching report" });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ["pending", "reviewed", "resolved"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const result = await pool.query(
      `UPDATE reports SET status = $1 WHERE id = $2
       RETURNING id, title, description, police_station, address, city, status, created_at`,
      [status, id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json({ message: "Status updated", report: result.rows[0] });
  } catch (err) {
    console.error("updateStatus error:", err);
    res.status(500).json({ error: "Server error while updating report" });
  }
};

module.exports = { createReport, getReports, getReportById, updateStatus };

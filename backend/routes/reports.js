// routes/reports.js
// Defines the URL endpoints for the reports API.
// Routes are thin — they just wire HTTP methods + URLs to controller functions.

const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/upload");
const {
  createReport,
  getReports,
  getReportById,
  updateStatus,
} = require("../controllers/reportController");

// POST /api/reports
// Accepts a multipart/form-data body with optional "image" and "video" files
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 }, // one image file
    { name: "video", maxCount: 1 }, // one video file
  ]),
  createReport
);

// GET /api/reports          — all reports (supports ?city=...&status=... filters)
router.get("/", getReports);

// GET /api/reports/:id      — single report
router.get("/:id", getReportById);

// PATCH /api/reports/:id/status  — update status (admin)
router.patch("/:id/status", updateStatus);

module.exports = router;

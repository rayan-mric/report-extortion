// routes/reports.js
const express = require("express");
const router = express.Router();
const {
  createReport,
  getReports,
  getReportById,
  updateStatus,
} = require("../controllers/reportController");

router.post("/", createReport);
router.get("/", getReports);
router.get("/:id", getReportById);
router.patch("/:id/status", updateStatus);

module.exports = router;

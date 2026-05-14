// src/components/ReportsList.jsx
// Shows all submitted reports in a card grid.
// Supports filtering by city and status.

import React, { useEffect, useState } from "react";
import { getReports } from "../services/api";

// Badge color by status
const STATUS_COLORS = {
  pending: "#f59e0b",
  reviewed: "#3b82f6",
  resolved: "#10b981",
};

// Single report card
function ReportCard({ report }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="report-card">
      <div className="card-header">
        <h4 className="card-title">{report.title}</h4>
        <span
          className="status-badge"
          style={{ backgroundColor: STATUS_COLORS[report.status] || "#6b7280" }}
        >
          {report.status}
        </span>
      </div>

      <div className="card-location">
        📍 {report.address}, {report.city}
        {report.police_station && ` — Near: ${report.police_station}`}
      </div>

      <p className="card-description">
        {expanded ? report.description : `${report.description.slice(0, 120)}…`}
      </p>

      {report.description.length > 120 && (
        <button className="btn-link" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Show less" : "Read more"}
        </button>
      )}

      {/* Show image if one was uploaded */}
      {report.image_url && (
        <img
          src={report.image_url}
          alt="Evidence"
          className="card-media"
        />
      )}

      {/* Show video if one was uploaded */}
      {report.video_url && (
        <video src={report.video_url} controls className="card-media" />
      )}

      <div className="card-footer">
        <span className="card-date">
          {new Date(report.created_at).toLocaleDateString("en-CA", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}

export default function ReportsList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter state
  const [cityFilter, setCityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch reports whenever filters change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getReports({ city: cityFilter, status: statusFilter });
        setReports(data.reports);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cityFilter, statusFilter]);

  return (
    <div className="reports-list">
      {/* ── Filters ── */}
      <div className="filters-bar">
        <input
          type="text"
          placeholder="Filter by city…"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="filter-input"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="resolved">Resolved</option>
        </select>

        {(cityFilter || statusFilter) && (
          <button
            className="btn-link"
            onClick={() => { setCityFilter(""); setStatusFilter(""); }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── States ── */}
      {loading && <p className="state-msg">Loading reports…</p>}
      {error && <p className="state-msg error">{error}</p>}
      {!loading && !error && reports.length === 0 && (
        <p className="state-msg">No reports found.</p>
      )}

      {/* ── Cards ── */}
      <div className="cards-grid">
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}

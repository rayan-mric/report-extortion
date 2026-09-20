import React, { useEffect, useMemo, useState } from "react";
import { getReports } from "../services/api";

const statusLabel = {
  pending: "Pending",
  reviewed: "Reviewed",
  resolved: "Resolved",
};

function formatDate(date) {
  if (!date) return "Unknown date";

  return new Date(date).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ReportCard({ report, onView }) {
  return (
    <article className="report-card">
      <div className="report-card-top">
        <span
          className={`status status-${report.status || "pending"}`}
        >
          {statusLabel[report.status] || report.status || "Pending"}
        </span>

        <span className="report-id">
          RS-{String(report.id).padStart(6, "0")}
        </span>
      </div>

      <h3>{report.title}</h3>

      <div className="report-location">
        <span className="location-symbol">⌖</span>
        <span>
          {report.address}, {report.city}
        </span>
      </div>

      <p className="report-description">
        {report.description.length > 150
          ? `${report.description.slice(0, 150)}...`
          : report.description}
      </p>

      <div className="report-card-divider" />

      <div className="report-card-bottom">
        <div>
          <span className="report-date-label">Submitted</span>
          <strong>{formatDate(report.created_at)}</strong>
        </div>

        <button
          type="button"
          className="report-view-button"
          onClick={() => onView(report)}
        >
          View report →
        </button>
      </div>
    </article>
  );
}

function ReportDetails({ report, onClose }) {
  if (!report) return null;

  return (
    <div className="report-modal-overlay" onClick={onClose}>
      <div
        className="report-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="report-modal-header">
          <div>
            <span className="eyebrow">Report details</span>

            <h2>{report.title}</h2>

            <span className="modal-reference">
              RS-{String(report.id).padStart(6, "0")}
            </span>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close report"
          >
            ×
          </button>
        </div>

        <div className="modal-status-row">
          <span
            className={`status status-${report.status || "pending"}`}
          >
            {statusLabel[report.status] || report.status || "Pending"}
          </span>

          <span>{formatDate(report.created_at)}</span>
        </div>

        <div className="modal-section">
          <span className="modal-label">What happened</span>

          <p className="modal-description">
            {report.description}
          </p>
        </div>

        <div className="modal-section">
          <span className="modal-label">Location</span>

          <div className="modal-location-grid">
            <div>
              <span>Street address</span>
              <strong>{report.address || "Not provided"}</strong>
            </div>

            <div>
              <span>City</span>
              <strong>{report.city || "Not provided"}</strong>
            </div>

            <div>
              <span>Nearest police station</span>
              <strong>
                {report.police_station || "Not provided"}
              </strong>
            </div>
          </div>
        </div>

        <div className="modal-privacy-note">
          <strong>Privacy reminder</strong>

          <p>
            This report does not display account, email, or phone
            information.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary modal-close-button"
          onClick={onClose}
        >
          Close report
        </button>
      </div>
    </div>
  );
}

export default function ReportsList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [city, setCity] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchReports = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getReports({
          city,
          status,
        });

        if (active) {
          setReports(data.reports || []);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Failed to load reports.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchReports();

    return () => {
      active = false;
    };
  }, [city, status]);

  const filteredReports = useMemo(() => {
    let result = [...reports];

    if (search.trim()) {
      const query = search.toLowerCase().trim();

      result = result.filter((report) => {
        return (
          report.title?.toLowerCase().includes(query) ||
          report.description?.toLowerCase().includes(query) ||
          report.city?.toLowerCase().includes(query) ||
          report.address?.toLowerCase().includes(query) ||
          String(report.id).includes(query)
        );
      });
    }

    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();

      return sortOrder === "newest"
        ? dateB - dateA
        : dateA - dateB;
    });

    return result;
  }, [reports, search, sortOrder]);

  const statistics = useMemo(() => {
    const cities = new Set(
      reports
        .map((report) => report.city)
        .filter(Boolean)
    );

    const pending = reports.filter(
      (report) => report.status === "pending"
    ).length;

    return {
      total: reports.length,
      cities: cities.size,
      pending,
    };
  }, [reports]);

  const clearFilters = () => {
    setCity("");
    setStatus("");
    setSearch("");
    setSortOrder("newest");
  };

  return (
    <div className="reports-page">

      {/* PAGE HEADER */}

      <div className="reports-page-header">
        <div>
          <span className="eyebrow">REPORT DATABASE</span>

          <h1>Submitted reports</h1>

          <p>
            Browse incident reports stored in the reporting
            system.
          </p>
        </div>

        <div className="reports-header-badge">
          <span>Live records</span>
          <strong>{statistics.total}</strong>
        </div>
      </div>

      {/* STATISTICS */}

      <div className="report-stat-grid">
        <div className="report-stat-card">
          <span>Total reports</span>
          <strong>
            {loading ? "..." : statistics.total}
          </strong>
          <small>Reports in current view</small>
        </div>

        <div className="report-stat-card">
          <span>Locations</span>
          <strong>
            {loading ? "..." : statistics.cities}
          </strong>
          <small>Unique cities represented</small>
        </div>

        <div className="report-stat-card">
          <span>Pending</span>
          <strong>
            {loading ? "..." : statistics.pending}
          </strong>
          <small>Reports awaiting review</small>
        </div>
      </div>

      {/* FILTERS */}

      <div className="reports-toolbar-new">

        <div className="reports-search">
          <span>⌕</span>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports, cities or reference numbers..."
          />
        </div>

        <div className="reports-filters">

          <input
            className="filter-input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Filter by city"
          />

          <select
            className="filter-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            className="filter-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>

          {(city || status || search) && (
            <button
              type="button"
              className="btn-link"
              onClick={clearFilters}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* RESULTS HEADER */}

      <div className="reports-results-header">
        <div>
          <strong>
            {loading
              ? "Loading reports..."
              : `${filteredReports.length} ${
                  filteredReports.length === 1
                    ? "report"
                    : "reports"
                }`}
          </strong>

          {!loading && (
            <span>
              {search || city || status
                ? "matching your filters"
                : "currently available"}
            </span>
          )}
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* LOADING */}

      {loading && !error && (
        <div className="reports-loading">
          <div className="loading-spinner" />
          <span>Loading reports...</span>
        </div>
      )}

      {/* EMPTY */}

      {!loading &&
        !error &&
        filteredReports.length === 0 && (
          <div className="reports-empty">
            <div className="empty-icon">R</div>

            <h3>No reports found</h3>

            <p>
              Try changing your search or filters, or submit a
              new report.
            </p>

            {(city || status || search) && (
              <button
                type="button"
                className="btn-secondary"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            )}
          </div>
        )}

      {/* REPORT GRID */}

      {!loading &&
        !error &&
        filteredReports.length > 0 && (
          <div className="report-grid-new">
            {filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onView={setSelectedReport}
              />
            ))}
          </div>
        )}

      {/* MODAL */}

      {selectedReport && (
        <ReportDetails
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}
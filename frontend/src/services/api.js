// src/services/api.js
// All API calls live here — keeps components clean.
// Uses the native fetch API (no axios needed).

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// ── Submit a new report (with optional files) ────────────────────────────────
// We use FormData because we might be uploading images/videos (multipart/form-data)
export async function submitReport(formData) {
  const response = await fetch(`${BASE_URL}/reports`, {
    method: "POST",
    // Do NOT set Content-Type header manually — browser sets it automatically
    // with the correct multipart boundary when you pass FormData
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    // Throw an error so the component can catch it and show a message
    throw new Error(data.error || "Failed to submit report");
  }

  return data;
}

// ── Get all reports (with optional filters) ──────────────────────────────────
export async function getReports({ city = "", status = "" } = {}) {
  // Build query string only for non-empty filters
  const params = new URLSearchParams();
  if (city) params.append("city", city);
  if (status) params.append("status", status);

  const query = params.toString() ? `?${params.toString()}` : "";

  const response = await fetch(`${BASE_URL}/reports${query}`);
  const data = await response.json();

  if (!response.ok) throw new Error(data.error || "Failed to fetch reports");
  return data;
}

// ── Get a single report by ID ─────────────────────────────────────────────────
export async function getReportById(id) {
  const response = await fetch(`${BASE_URL}/reports/${id}`);
  const data = await response.json();

  if (!response.ok) throw new Error(data.error || "Report not found");
  return data;
}

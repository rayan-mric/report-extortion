const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export async function submitReport(report) {
  const response = await fetch(`${BASE_URL}/reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(report),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to submit report");
  return data;
}

export async function getReports({ city = "", status = "" } = {}) {
  const params = new URLSearchParams();
  if (city) params.append("city", city);
  if (status) params.append("status", status);

  const query = params.toString() ? `?${params.toString()}` : "";
  const response = await fetch(`${BASE_URL}/reports${query}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to fetch reports");
  return data;
}

export async function getReportById(id) {
  const response = await fetch(`${BASE_URL}/reports/${id}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Report not found");
  return data;
}

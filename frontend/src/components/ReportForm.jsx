// src/components/ReportForm.jsx
// The main form where users submit an extortion incident report.
// Handles text fields, file uploads, validation, loading state, and success/error feedback.

import React, { useState } from "react";
import { submitReport } from "../services/api";

// Preview component — shows a thumbnail of a selected image or video
function FilePreview({ file, type }) {
  if (!file) return null;

  const url = URL.createObjectURL(file);

  return (
    <div className="file-preview">
      {type === "image" ? (
        <img src={url} alt="Preview" />
      ) : (
        <video src={url} controls />
      )}
      <span className="file-name">{file.name}</span>
    </div>
  );
}

export default function ReportForm({ onSuccess }) {
  // Form field state
  const [form, setForm] = useState({
    title: "",
    description: "",
    police_station: "",
    address: "",
    city: "",
  });

  // File state (separate from text fields because files don't go in useState as values)
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Generic handler for all text inputs
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0] || null);
  };

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Build a FormData object — required for multipart file uploads
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("police_station", form.police_station);
    formData.append("address", form.address);
    formData.append("city", form.city);

    // Only append files if the user actually selected one
    if (imageFile) formData.append("image", imageFile);
    if (videoFile) formData.append("video", videoFile);

    try {
      const data = await submitReport(formData);
      setSuccess(true);
      onSuccess && onSuccess(data.report);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // After success, show a confirmation message instead of the form
  if (success) {
    return (
      <div className="success-message">
        <div className="success-icon">✓</div>
        <h2>Report Submitted</h2>
        <p>Your report has been received anonymously. Thank you for helping fight financial crime.</p>
        <button
          className="btn-primary"
          onClick={() => {
            setSuccess(false);
            setForm({ title: "", description: "", police_station: "", address: "", city: "" });
            setImageFile(null);
            setVideoFile(null);
          }}
        >
          Submit Another Report
        </button>
      </div>
    );
  }

  return (
    <form className="report-form" onSubmit={handleSubmit} noValidate>

      {/* Error banner */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* ── Incident Details ── */}
      <section className="form-section">
        <h3 className="section-title">Incident Details</h3>

        <div className="field">
          <label htmlFor="title">Incident Title *</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="e.g. Business extortion demand"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            rows={5}
            placeholder="Describe what happened in as much detail as you feel comfortable sharing..."
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>
      </section>

      {/* ── Location ── */}
      <section className="form-section">
        <h3 className="section-title">Location</h3>

        <div className="field">
          <label htmlFor="police_station">Nearest Police Station</label>
          <input
            id="police_station"
            name="police_station"
            type="text"
            placeholder="e.g. 52 Division"
            value={form.police_station}
            onChange={handleChange}
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="address">Street Address *</label>
            <input
              id="address"
              name="address"
              type="text"
              placeholder="e.g. 123 Main Street"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="city">City *</label>
            <input
              id="city"
              name="city"
              type="text"
              placeholder="e.g. Toronto"
              value={form.city}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </section>

      {/* ── Evidence Upload ── */}
      <section className="form-section">
        <h3 className="section-title">Evidence (Optional)</h3>
        <p className="section-note">
          Files are stored securely on encrypted cloud storage. Max 10MB for images, 100MB for video.
        </p>

        <div className="field-row">
          <div className="field">
            <label htmlFor="image">Image (jpg, png, webp)</label>
            <input
              id="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="file-input"
            />
            <FilePreview file={imageFile} type="image" />
          </div>

          <div className="field">
            <label htmlFor="video">Video (mp4, mov)</label>
            <input
              id="video"
              type="file"
              accept="video/mp4,video/quicktime"
              onChange={handleVideoChange}
              className="file-input"
            />
            <FilePreview file={videoFile} type="video" />
          </div>
        </div>
      </section>

      {/* ── Submit ── */}
      <div className="form-footer">
        <p className="anonymity-notice">
          🔒 This report is submitted anonymously. No personal information is collected.
        </p>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Submitting…" : "Submit Report"}
        </button>
      </div>
    </form>
  );
}

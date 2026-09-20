import React, { useState } from "react";
import { submitReport } from "../services/api";

const initialForm = {
  title: "",
  description: "",
  police_station: "",
  address: "",
  city: "",
};

export default function ReportForm({ onSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submittedId, setSubmittedId] = useState(null);
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const validateDetails = () => {
    if (!form.title.trim()) {
      setError("Please enter an incident title.");
      return false;
    }

    if (!form.description.trim()) {
      setError("Please describe what happened.");
      return false;
    }

    return true;
  };

  const validateLocation = () => {
    if (!form.address.trim()) {
      setError("Please enter the street address.");
      return false;
    }

    if (!form.city.trim()) {
      setError("Please enter the city.");
      return false;
    }

    return true;
  };

  const handleNext = () => {
    setError("");

    if (step === 1 && !validateDetails()) {
      return;
    }

    if (step === 2 && !validateLocation()) {
      return;
    }

    setStep((current) => current + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setError("");
    setStep((current) => Math.max(1, current - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await submitReport(form);

      setSubmittedId(data.report.id);
      setForm(initialForm);
      setStep(1);

      onSuccess?.(data.report);
    } catch (err) {
      setError(err.message || "Unable to submit the report.");
    } finally {
      setLoading(false);
    }
  };

  if (submittedId) {
    return (
      <div className="success-card">
        <div className="success-check">✓</div>

        <span className="eyebrow">Report received</span>

        <h2>Your report has been submitted.</h2>

        <p>
          The report was successfully stored in the system. Keep the reference
          number below if you need to identify this submission later.
        </p>

        <div className="reference-box">
          <span>Reference number</span>

          <strong>
            RS-{String(submittedId).padStart(6, "0")}
          </strong>
        </div>

        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            setSubmittedId(null);
            setStep(1);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Submit another report
        </button>
      </div>
    );
  }

  return (
    <form className="report-form" onSubmit={handleSubmit}>
      {/* PROGRESS */}

      <div className="form-progress">
        <div className={step >= 1 ? "progress-step active" : "progress-step"}>
          <span>01</span>
          <div>
            <strong>Incident</strong>
            <small>Details</small>
          </div>
        </div>

        <div className="progress-line" />

        <div className={step >= 2 ? "progress-step active" : "progress-step"}>
          <span>02</span>
          <div>
            <strong>Location</strong>
            <small>Where it happened</small>
          </div>
        </div>

        <div className="progress-line" />

        <div className={step >= 3 ? "progress-step active" : "progress-step"}>
          <span>03</span>
          <div>
            <strong>Review</strong>
            <small>Check & submit</small>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* STEP 1 */}

      {step === 1 && (
        <div className="form-card">
          <div className="form-card-heading">
            <div>
              <span className="step">01</span>

              <div>
                <h2>Incident details</h2>

                <p>
                  Describe what happened as clearly and accurately as
                  possible.
                </p>
              </div>
            </div>
          </div>

          <div className="field">
            <label htmlFor="title">
              Incident title <span>*</span>
            </label>

            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Extortion demand received by business"
              value={form.title}
              onChange={handleChange}
              maxLength={255}
              required
            />

            <div className="field-help">
              Use a short title that summarizes the incident.
            </div>
          </div>

          <div className="field">
            <div className="label-row">
              <label htmlFor="description">
                What happened? <span>*</span>
              </label>

              <span className="character-count">
                {form.description.length}/2000
              </span>
            </div>

            <textarea
              id="description"
              name="description"
              rows={8}
              maxLength={2000}
              placeholder="Describe the incident, what was requested, when it occurred, and any other relevant details."
              value={form.description}
              onChange={handleChange}
              required
            />

            <div className="field-help">
              Focus on the facts. Avoid passwords, financial account
              credentials, or other sensitive information.
            </div>
          </div>

          <div className="form-navigation">
            <span>Step 1 of 3</span>

            <button
              type="button"
              className="btn-primary"
              onClick={handleNext}
            >
              Continue to location →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 */}

      {step === 2 && (
        <div className="form-card">
          <div className="form-card-heading">
            <div>
              <span className="step">02</span>

              <div>
                <h2>Incident location</h2>

                <p>
                  Add the location associated with the incident.
                </p>
              </div>
            </div>
          </div>

          <div className="location-note">
            <div className="location-note-icon">i</div>

            <p>
              Only provide a location you are comfortable sharing. You do not
              need to provide your personal address unless it is relevant to
              the incident.
            </p>
          </div>

          <div className="field">
            <label htmlFor="police_station">
              Nearest police station
            </label>

            <input
              id="police_station"
              name="police_station"
              type="text"
              placeholder="Optional"
              value={form.police_station}
              onChange={handleChange}
              maxLength={255}
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="address">
                Street address <span>*</span>
              </label>

              <input
                id="address"
                name="address"
                type="text"
                placeholder="123 Main Street"
                value={form.address}
                onChange={handleChange}
                maxLength={255}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="city">
                City <span>*</span>
              </label>

              <input
                id="city"
                name="city"
                type="text"
                placeholder="Toronto"
                value={form.city}
                onChange={handleChange}
                maxLength={100}
                required
              />
            </div>
          </div>

          <div className="form-navigation">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleBack}
            >
              ← Back
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={handleNext}
            >
              Review report →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}

      {step === 3 && (
        <div className="form-card">
          <div className="form-card-heading">
            <div>
              <span className="step">03</span>

              <div>
                <h2>Review your report</h2>

                <p>
                  Check the information before submitting the report.
                </p>
              </div>
            </div>
          </div>

          <div className="review-section">
            <div className="review-heading">
              <span>Incident details</span>

              <button
                type="button"
                className="btn-link"
                onClick={() => setStep(1)}
              >
                Edit
              </button>
            </div>

            <div className="review-item">
              <span>Title</span>
              <strong>{form.title}</strong>
            </div>

            <div className="review-item">
              <span>Description</span>
              <p>{form.description}</p>
            </div>
          </div>

          <div className="review-section">
            <div className="review-heading">
              <span>Location</span>

              <button
                type="button"
                className="btn-link"
                onClick={() => setStep(2)}
              >
                Edit
              </button>
            </div>

            <div className="review-grid">
              <div className="review-item">
                <span>Nearest police station</span>
                <strong>
                  {form.police_station || "Not provided"}
                </strong>
              </div>

              <div className="review-item">
                <span>City</span>
                <strong>{form.city}</strong>
              </div>

              <div className="review-item review-full">
                <span>Street address</span>
                <strong>{form.address}</strong>
              </div>
            </div>
          </div>

          <div className="review-warning">
            <div className="review-warning-icon">!</div>

            <div>
              <strong>Before submitting</strong>

              <p>
                Make sure the information is accurate and does not contain
                passwords, financial account credentials, or other unnecessary
                sensitive information.
              </p>
            </div>
          </div>

          <div className="form-navigation">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleBack}
              disabled={loading}
            >
              ← Back
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Submitting report..." : "Submit report →"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
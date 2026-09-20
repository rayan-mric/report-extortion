import React, { useState } from "react";
import ReportForm from "./components/ReportForm";
import ReportsList from "./components/ReportsList";
import "./App.css";

const features = [
  {
    number: "01",
    title: "Create a report",
    text: "Enter the incident details through a structured reporting form designed to keep the information clear and organized.",
  },
  {
    number: "02",
    title: "Submit the record",
    text: "The React frontend sends the report through a REST API built with Express.js and stores it in PostgreSQL.",
  },
  {
    number: "03",
    title: "Manage reports",
    text: "Submitted records can be retrieved and filtered by city and status through the reporting interface.",
  },
];

const techStack = ["React", "Express.js", "PostgreSQL", "REST API"];

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  const goToReport = () => {
    setActiveTab("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToHome = () => {
    setActiveTab("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <button
            className="brand"
            onClick={goToHome}
            aria-label="Go to home"
          >
            <span className="brand-mark">R</span>

            <span className="brand-text">
              <strong>ReportSafe</strong>
              <small>Extortion reporting platform</small>
            </span>
          </button>

          <nav className="nav" aria-label="Main navigation">
            <button
              className={activeTab === "home" ? "nav-link active" : "nav-link"}
              onClick={goToHome}
            >
              Home
            </button>

            <button
              className={activeTab === "form" ? "nav-link active" : "nav-link"}
              onClick={goToReport}
            >
              Submit a report
            </button>

            <button
              className={activeTab === "list" ? "nav-link active" : "nav-link"}
              onClick={() => {
                setActiveTab("list");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Reports
            </button>
          </nav>

          <button className="nav-cta" onClick={goToReport}>
            Report an incident
          </button>
        </div>
      </header>

      <main>
        {activeTab === "home" && (
          <>
            <section className="hero">
              <div className="hero-inner">
                <div className="hero-copy">
                  <div className="hero-badge">
                    <span className="status-dot" />
                    Private reporting platform
                  </div>

                  <h1>
                    Report an incident.
                    <span> Keep the facts organized.</span>
                  </h1>

                  <p className="hero-text">
                    A full-stack platform for documenting extortion incidents
                    through a structured reporting workflow. Submit a report,
                    receive a reference number, and manage structured records
                    through the platform.
                  </p>

                  <div className="hero-actions">
                    <button className="btn-primary" onClick={goToReport}>
                      Submit a report
                      <span>→</span>
                    </button>

                    <button
                      className="btn-secondary"
                      onClick={() => {
                        setActiveTab("list");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      View reports
                    </button>
                  </div>

                  <div className="hero-points">
                    <span>
                      <b>✓</b> No account required
                    </span>

                    <span>
                      <b>✓</b> Structured reporting
                    </span>

                    <span>
                      <b>✓</b> PostgreSQL records
                    </span>
                  </div>
                </div>

                <div className="hero-product">
                  <div className="product-window">
                    <div className="product-header">
                      <div>
                        <span className="product-dot green" />
                        <span className="product-dot yellow" />
                        <span className="product-dot red" />
                      </div>

                      <span className="product-title">REPORTSAFE</span>

                      <span className="product-number">01</span>
                    </div>

                    <div className="product-body">
                      <div className="product-heading">
                        <span className="product-eyebrow">
                          NEW INCIDENT
                        </span>

                        <h3>Document an incident</h3>

                        <p>
                          Record the facts through a simple structured form.
                        </p>
                      </div>

                      <div className="mock-field">
                        <span>Incident title</span>
                        <div>Extortion demand received</div>
                      </div>

                      <div className="mock-field">
                        <span>Location</span>
                        <div>St. John's, NL</div>
                      </div>

                      <div className="mock-row">
                        <div className="mock-status">
                          <span />
                          Ready to submit
                        </div>

                        <div className="mock-button">
                          Submit
                        </div>
                      </div>
                    </div>

                    <div className="product-footer">
                      <span>React</span>
                      <span>Express API</span>
                      <span>PostgreSQL</span>
                    </div>
                  </div>

                  <div className="floating-card floating-card-top">
                    <span className="floating-label">REPORT STATUS</span>
                    <strong>Structured</strong>
                    <small>Ready for review</small>
                  </div>

                  <div className="floating-card floating-card-bottom">
                    <span className="floating-number">03</span>
                    <div>
                      <strong>Core layers</strong>
                      <small>Frontend · API · Database</small>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="stack-section">
              <div className="stack-inner">
                <div>
                  <span className="stack-label">Built with</span>
                  <strong>A modern full-stack architecture</strong>
                </div>

                <div className="tech-list">
                  {techStack.map((tech) => (
                    <span key={tech} className="tech-chip">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section className="section light-section">
              <div className="section-heading">
                <span className="eyebrow">How it works</span>

                <h2>
                  From incident details to a structured database record.
                </h2>

                <p>
                  The application connects a React interface with an Express
                  REST API and PostgreSQL database to provide a complete
                  reporting workflow.
                </p>
              </div>

              <div className="feature-grid">
                {features.map((feature) => (
                  <article className="feature-card" key={feature.number}>
                    <div className="feature-top">
                      <span className="feature-number">
                        {feature.number}
                      </span>

                      <span className="feature-arrow">↗</span>
                    </div>

                    <h3>{feature.title}</h3>

                    <p>{feature.text}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="section architecture-section">
              <div className="architecture-card">
                <div className="architecture-copy">
                  <span className="eyebrow">Application architecture</span>

                  <h2>One workflow. Three connected layers.</h2>

                  <p>
                    The project demonstrates how a modern web interface can
                    communicate with a backend API and persist structured data
                    in a relational database.
                  </p>

                  <button className="btn-primary" onClick={goToReport}>
                    Try the reporting form
                    <span>→</span>
                  </button>
                </div>

                <div className="architecture-flow">
                  <div className="architecture-node">
                    <span>01</span>
                    <strong>React</strong>
                    <small>User interface</small>
                  </div>

                  <div className="flow-line">
                    <span>REST</span>
                    <i />
                  </div>

                  <div className="architecture-node">
                    <span>02</span>
                    <strong>Express.js</strong>
                    <small>API layer</small>
                  </div>

                  <div className="flow-line">
                    <span>SQL</span>
                    <i />
                  </div>

                  <div className="architecture-node">
                    <span>03</span>
                    <strong>PostgreSQL</strong>
                    <small>Data storage</small>
                  </div>
                </div>
              </div>
            </section>

            <section className="section privacy-section">
              <div className="privacy-card">
                <div className="privacy-mark">+</div>

                <div>
                  <span className="eyebrow">Before you submit</span>

                  <h2>
                    Only include information you are comfortable sharing.
                  </h2>

                  <p>
                    Do not include passwords, financial account credentials,
                    or other highly sensitive information. This platform is
                    designed for documenting incident details.
                  </p>
                </div>

                <button className="btn-primary" onClick={goToReport}>
                  Start a report →
                </button>
              </div>
            </section>
          </>
        )}

        {activeTab === "form" && (
          <section className="page-shell">
            <div className="page-intro">
              <span className="eyebrow">01 / Report</span>

              <h1>Submit an incident report</h1>

              <p>
                Provide the facts you are comfortable sharing. No account or
                contact information is required.
              </p>
            </div>

            <ReportForm onSuccess={() => {}} />
          </section>
        )}

        {activeTab === "list" && (
          <section className="page-shell">
            <div className="page-intro">
              <span className="eyebrow">02 / Reports</span>

              <h1>Submitted reports</h1>

              <p>
                Browse the structured report records currently available in
                the platform.
              </p>
            </div>

            <ReportsList />
          </section>
        )}
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div>
            <strong>ReportSafe</strong>
            <span>Extortion reporting platform</span>
          </div>

          <div className="footer-stack">
            <span>React</span>
            <span>Express.js</span>
            <span>PostgreSQL</span>
          </div>

          <span>Personal full-stack project · 2026</span>
        </div>
      </footer>
    </div>
  );
}
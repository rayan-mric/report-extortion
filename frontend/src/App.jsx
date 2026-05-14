// src/App.jsx
// Root component. Handles simple tab-based navigation between
// "Submit Report" and "View Reports" pages.

import React, { useState } from "react";
import ReportForm from "./components/ReportForm";
import ReportsList from "./components/ReportsList";
import "./App.css";

export default function App() {
  // "form" | "list"
  const [activeTab, setActiveTab] = useState("form");

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-icon">🛡</span>
            <div>
              <h1 className="brand-name">SafeReport</h1>
              <p className="brand-tagline">Anonymous Financial Crime Reporting</p>
            </div>
          </div>

          {/* Tab navigation */}
          <nav className="nav">
            <button
              className={`nav-tab ${activeTab === "form" ? "active" : ""}`}
              onClick={() => setActiveTab("form")}
            >
              Report Incident
            </button>
            <button
              className={`nav-tab ${activeTab === "list" ? "active" : ""}`}
              onClick={() => setActiveTab("list")}
            >
              View Reports
            </button>
          </nav>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="main">
        <div className="container">
          {activeTab === "form" ? (
            <>
              <div className="page-heading">
                <h2>Submit an Incident Report</h2>
                <p>
                  All reports are anonymous. Your identity is never stored.
                  Help us build a safer financial environment.
                </p>
              </div>
              <ReportForm onSuccess={() => setActiveTab("list")} />
            </>
          ) : (
            <>
              <div className="page-heading">
                <h2>Submitted Reports</h2>
                <p>Browse and filter incident reports from the community.</p>
              </div>
              <ReportsList />
            </>
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="footer">
        <p>SafeReport Platform — Built with React · Express.js · PostgreSQL · AWS S3</p>
      </footer>
    </div>
  );
}

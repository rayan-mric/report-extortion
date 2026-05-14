-- ============================================================
--  CrimeReport Platform - Database Schema
--  Run this file once to set up your PostgreSQL database:
--  psql -U youruser -d yourdb -f schema.sql
-- ============================================================

-- Main table that stores every incident report
CREATE TABLE IF NOT EXISTS reports (
  id            SERIAL PRIMARY KEY,              -- auto-incrementing ID
  title         VARCHAR(255) NOT NULL,           -- short title of the incident
  description   TEXT NOT NULL,                   -- full text description

  -- Location fields
  police_station VARCHAR(255),                   -- nearest police station
  address        VARCHAR(255) NOT NULL,          -- street address
  city           VARCHAR(100) NOT NULL,          -- city name

  -- Media stored as S3 URLs (can be NULL if no file uploaded)
  image_url     TEXT,
  video_url     TEXT,

  -- Status for admin tracking
  status        VARCHAR(50) DEFAULT 'pending',   -- pending | reviewed | resolved

  created_at    TIMESTAMP DEFAULT NOW()          -- when the report was submitted
);

-- Index on city so filtering by city is fast
CREATE INDEX IF NOT EXISTS idx_reports_city ON reports(city);

-- Index on status for admin dashboard queries
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

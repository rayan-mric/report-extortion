-- ============================================================
-- Report Platform - PostgreSQL schema
-- ============================================================

CREATE TABLE IF NOT EXISTS reports (
  id              SERIAL PRIMARY KEY,
  title           VARCHAR(255) NOT NULL,
  description     TEXT NOT NULL,
  police_station  VARCHAR(255),
  address         VARCHAR(255) NOT NULL,
  city            VARCHAR(100) NOT NULL,
  status          VARCHAR(50) DEFAULT 'pending',
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_city ON reports(city);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

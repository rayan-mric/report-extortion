// db/pool.js
// This file creates a single PostgreSQL connection pool
// that the whole app reuses (efficient — no new connection per request)

const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Optional: increase if you expect high traffic
  max: 10,
  idleTimeoutMillis: 30000,
});

// Test the connection when the server starts
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to PostgreSQL");
    release(); // always release the client back to the pool
  }
});

module.exports = pool;

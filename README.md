# SafeReport — Anonymous Financial Crime Reporting Platform

A full-stack web application that allows users to **anonymously report extortion and financial crime incidents**, including location details and media evidence (images/videos). Built as a portfolio project demonstrating modern full-stack development practices.

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, CSS3 (custom design system)   |
| Backend    | Node.js, Express.js                     |
| Database   | PostgreSQL                              |
| File Storage | AWS S3 (via AWS SDK v3)               |
| Middleware | Multer (file parsing), Helmet (security), CORS |

---

## Features

- **Anonymous reporting** — no login required, no personal data collected
- **Incident form** with title, description, location (police station, address, city)
- **Media uploads** — images (jpg/png/webp) and videos (mp4/mov) stored securely on AWS S3
- **Reports feed** — browse all submitted reports with filtering by city and status
- **REST API** with proper validation and error handling
- **PostgreSQL** for structured incident data with indexed queries

---

## Project Structure

```
crimereport/
├── backend/
│   ├── config/
│   │   └── s3.js               # AWS S3 client setup
│   ├── controllers/
│   │   └── reportController.js # Business logic for all report operations
│   ├── db/
│   │   ├── pool.js             # PostgreSQL connection pool
│   │   └── schema.sql          # Database table + indexes
│   ├── middleware/
│   │   └── upload.js           # Multer config + S3 upload helper
│   ├── routes/
│   │   └── reports.js          # API route definitions
│   ├── .env.example            # Required environment variables
│   ├── package.json
│   └── server.js               # Express app entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ReportForm.jsx   # Submit incident form
    │   │   └── ReportsList.jsx  # Browse & filter reports
    │   ├── services/
    │   │   └── api.js           # All API fetch calls
    │   ├── App.jsx              # Root component + tab navigation
    │   ├── App.css              # Full design system
    │   └── index.js             # React entry point
    ├── .env.example
    └── package.json
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [PostgreSQL](https://www.postgresql.org/) running locally
- An [AWS account](https://aws.amazon.com/) with an S3 bucket

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/crimereport.git
cd crimereport
```

---

### 2. Set Up the Database

Open your PostgreSQL client (psql or TablePlus) and run:

```bash
psql -U youruser -d yourdb -f backend/db/schema.sql
```

This creates the `reports` table and indexes.

---

### 3. Configure the Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/crimereport
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
CLIENT_URL=http://localhost:3000
PORT=5000
```

**AWS S3 setup tip:** In your S3 bucket settings, make sure to:
1. Uncheck "Block all public access" (so uploaded files can be viewed)
2. Create an IAM user with `AmazonS3FullAccess` and use its credentials above

Install dependencies and start:

```bash
npm install
npm run dev     # uses nodemon for auto-restart on file changes
```

Server runs at: `http://localhost:5000`

---

### 4. Configure the Frontend

```bash
cd ../frontend
cp .env.example .env
```

`.env` should contain:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Install and start:

```bash
npm install
npm start
```

App runs at: `http://localhost:3000`

---

## API Reference

| Method | Endpoint                    | Description                          |
|--------|-----------------------------|--------------------------------------|
| POST   | `/api/reports`              | Submit a new report (multipart form) |
| GET    | `/api/reports`              | Get all reports (supports `?city=` `?status=` filters) |
| GET    | `/api/reports/:id`          | Get a single report by ID            |
| PATCH  | `/api/reports/:id/status`   | Update a report's status             |

### Example: Submit a Report

```bash
curl -X POST http://localhost:5000/api/reports \
  -F "title=Business extortion demand" \
  -F "description=Received threatening message demanding payment" \
  -F "address=123 King Street" \
  -F "city=Toronto" \
  -F "police_station=52 Division" \
  -F "image=@/path/to/screenshot.jpg"
```

### Example Response

```json
{
  "message": "Report submitted successfully",
  "report": {
    "id": 1,
    "title": "Business extortion demand",
    "description": "Received threatening message demanding payment",
    "police_station": "52 Division",
    "address": "123 King Street",
    "city": "Toronto",
    "image_url": "https://your-bucket.s3.us-east-1.amazonaws.com/reports/abc-123.jpg",
    "video_url": null,
    "status": "pending",
    "created_at": "2024-11-01T14:30:00.000Z"
  }
}
```

---

## Key Technical Decisions

**Why `multer.memoryStorage()` instead of disk storage?**
Files are kept in memory (as a Buffer) and forwarded directly to S3 without touching the filesystem. This is the correct approach for cloud servers whose local storage can be wiped on restart.

**Why separate `controllers/` from `routes/`?**
Routes define *what URL* triggers *what action*. Controllers contain the *actual logic*. This separation makes each file smaller and easier to test.

**Why a connection pool for PostgreSQL?**
A pool reuses existing database connections instead of opening a new one for every request — much more efficient under real traffic.

---

## Future Improvements

- [ ] JWT authentication for an admin dashboard
- [ ] Email notifications when a report is marked resolved
- [ ] Map view using Leaflet to visualize incidents by location
- [ ] Rate limiting (express-rate-limit) to prevent spam submissions
- [ ] Unit tests with Jest + Supertest

---

## Author

Built by [Your Name] as a portfolio project for co-op applications.

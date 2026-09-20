# ReportSafe

A full-stack web application for submitting and managing anonymous extortion incident reports.

## Stack

- React
- Express.js
- PostgreSQL
- REST API
- Helmet + CORS

## Project structure

```text
backend/
  controllers/   API business logic
  db/            PostgreSQL connection and schema
  routes/        REST endpoints
  server.js      Express entry point

frontend/
  src/components/  Report form and report list
  src/services/    API client
  App.jsx          Application navigation and landing page
  App.css          Responsive UI
```

## Local setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm start
```

Set `DATABASE_URL` in `.env` to your PostgreSQL database.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

Set `REACT_APP_API_URL` to the URL of the Express API, for example:

```text
http://localhost:5000/api
```

## API

- `POST /api/reports` creates a report
- `GET /api/reports` lists reports and supports `city` and `status` filters
- `GET /api/reports/:id` retrieves one report
- `PATCH /api/reports/:id/status` updates report status
- `GET /health` checks the API

## Notes

The current version does not use AWS S3 or file-upload middleware. Reports contain structured text and location data stored in PostgreSQL.

# Job Board Application (Next.js)

A full-stack job board MVP for publishing vacancies, managing resumes, processing applications, and supporting communication between candidates and companies.

## Requirements

- Node.js 20+
- npm, Yarn, or pnpm
- Python 3.11+ for the supporting tooling used by the project
- MongoDB running locally

## Install and run

```bash
cd <project-folder>
npm install
npm run dev
```

Open `http://localhost:3000` in a browser. Use the environment variables documented in the source configuration when connecting to a non-default MongoDB instance.

## Main domain objects

The application is organized around users, companies, jobs, resumes, applications, and messages. Next.js provides the UI and server-side API routes in one application, which keeps the local development workflow compact and easy to evaluate.

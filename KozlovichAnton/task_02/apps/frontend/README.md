# Frontend - Bug Tracker SPA

React and Vite client for project and issue management.

## Requirements

- Node.js 18+
- backend available at the URL configured by `VITE_API_URL` (default: `http://localhost:4000`)

## Run

```bash
npm install
copy .env.example .env
npm run dev -w frontend
npm run build -w frontend
```

## User flows

The SPA supports registration and login, protected routing, project and member management, bug CRUD, comments, attachments, and role-aware views. Access tokens are kept in memory; an expired token is refreshed through `/auth/refresh` using the HttpOnly cookie before the original request is retried.

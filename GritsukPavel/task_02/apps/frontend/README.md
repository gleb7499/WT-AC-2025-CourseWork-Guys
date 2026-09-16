# Frontend - Offer Tracker

React SPA for tracking job applications through a kanban workflow.

## Features

- company and vacancy lists;
- configurable application stages;
- kanban board with notes and reminders;
- protected routes and role-aware administration;
- forms with client-side validation;
- automatic access-token refresh through the backend.

## Technology

- React 18, TypeScript, and Vite
- React Router
- React Hook Form and Zod

## Run

From the monorepo root:

```bash
npm install
npm run dev:frontend
```

The frontend is normally available at `http://localhost:5173`; the backend should run on its configured API port.

# Room Booking MVP

A full-stack scheduling application for managing rooms, bookings, and availability.

## Stack

- Express, PostgreSQL, and Prisma
- React, TypeScript, and Vite
- JWT authentication with access and refresh tokens
- CORS with credentials and secure cookie handling

## Features

- administrator room management;
- booking creation and schedule views;
- cancellation and rescheduling within the permission model;
- protected routes and ownership-aware access;
- automatic access-token refresh.

## Quick start

```bash
npm install
npm run dev
```

The backend normally runs on `http://localhost:3001` and the frontend on `http://localhost:5173`. Configure `DATABASE_URL`, CORS origin, and JWT secrets in `apps/backend/.env`.

Check `apps/backend/README.md` and `apps/frontend/README.md` for service-specific commands and environment details.

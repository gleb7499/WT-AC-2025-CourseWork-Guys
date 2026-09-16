# Backend - Room Booking API

Express and Prisma REST API backed by PostgreSQL.

## Requirements

- Node.js 18+
- PostgreSQL

## Setup

```bash
npm install
copy .env.example .env
npx prisma migrate dev
npm run dev
```

Set `DATABASE_URL`, `CORS_ORIGIN`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET`. The API exposes health, authentication, room, booking, and schedule endpoints with role-aware access control.

Refresh tokens are stored in HttpOnly cookies, while access tokens remain in application memory on the frontend.

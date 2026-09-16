# Backend - Trip Planner API

Express, TypeScript, Prisma, and PostgreSQL API for trips, stops, notes, expenses, dates, and sharing.

## Responsibilities

- registration, login, refresh, and logout endpoints;
- trip and stop CRUD;
- notes, expenses, and date management;
- participant sharing and removal;
- role and ownership checks;
- JWT rotation in HttpOnly cookies;
- bcrypt password hashing, Zod validation, Helmet, and CORS.

## Setup

```bash
npm install
copy .env.example .env
npx prisma migrate dev
npm run seed
npm run dev
```

Set `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and `CORS_ORIGIN` in `.env`.

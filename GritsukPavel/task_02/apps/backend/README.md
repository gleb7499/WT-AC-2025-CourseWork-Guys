# Backend - Offer Tracker

Express and Prisma API for companies, vacancies, application stages, notes, reminders, and the kanban board.

## Implemented functionality

- models: User, Company, Job, Stage, Note, Reminder, and RefreshToken;
- `/api/auth`, `/api/users`, `/api/companies`, `/api/jobs`, `/api/stages`, `/api/notes`, `/api/reminders`, and `/api/kanban` routes;
- `admin` and `user` roles with resource ownership checks;
- CRUD for user-owned resources and administrative user management;
- rotating refresh tokens in HttpOnly cookies;
- bcrypt, Helmet, CORS with credentials, Zod, and authentication rate limits.

## Setup

```bash
npm install
copy .env.example .env
npx prisma migrate dev
npm run seed
npm run dev
```

Required secrets include `DATABASE_URL`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET`.

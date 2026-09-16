# Backend - Progress Tracker

Express and Prisma API backed by PostgreSQL.

## Implemented functionality

- models: User, Topic, Goal, ProgressEntry, and RefreshToken;
- JWT access and refresh authentication with cookie-based rotation;
- admin and user roles with explicit resource permissions;
- CRUD for topics, goals, and progress entries;
- Zod validation for incoming data;
- Helmet, CORS with credentials, bcrypt, and centralized error logging.

## Requirements

- Node.js 18+
- PostgreSQL

## Run

```bash
npm install
copy .env.example .env
npx prisma migrate dev
npm run seed
npm run dev
```

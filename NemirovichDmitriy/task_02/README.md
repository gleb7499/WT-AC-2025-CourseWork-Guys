# Trip Planner "Let's Go!" (Variant 35)

A full-stack MVP for planning trips with routes, places, dates, budgets, notes, and controlled sharing.

## Stack

- React, TypeScript, Vite
- Node.js, Express, TypeScript
- PostgreSQL and Prisma
- JWT access/refresh rotation, bcrypt, Zod, Helmet, CORS
- React Router, React Hook Form, and Axios

## Features

- create and manage trips;
- add stops, notes, and expenses;
- track dates and budgets;
- share a trip with another user by UUID;
- remove participants according to owner permissions;
- protected resources with `user` and `admin` roles.

## Run

```bash
npm install
npm run prisma:migrate:dev -- --name init
npm run prisma:seed -w backend
npm run dev
```

The frontend is available at `http://localhost:5173`; the backend uses `http://localhost:4000` by default. Configure both environment files from their examples.

Detailed API and UI documentation is available in `apps/backend/README.md` and `apps/frontend/README.md`.

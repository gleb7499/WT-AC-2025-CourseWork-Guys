# Offer Tracker (Variant 32)

An MVP job application tracker that helps users manage companies, vacancies, application stages, notes, reminders, and a kanban workflow.

## Stack

- React, TypeScript, Vite
- Node.js, Express, TypeScript
- PostgreSQL and Prisma
- JWT access/refresh authentication, bcrypt, Zod

## Features

- company and vacancy management;
- customizable application stages;
- kanban board for tracking applications;
- notes and reminders;
- admin and user roles with ownership checks;
- rate limiting for authentication endpoints;
- secure cookies, Helmet, CORS, and validation.

## Run

```bash
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Configure `apps/backend/.env` and `apps/frontend/.env` using the provided examples. Service-specific API and UI notes are documented in the nested README files.

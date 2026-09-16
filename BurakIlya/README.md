# Community Support Platform (Variant 43)

A full-stack MVP for coordinating community assistance: people can publish requests, volunteers can respond, and administrators can supervise the workflow.

## Stack

- React, TypeScript, and Vite
- Node.js, Express, and TypeScript
- PostgreSQL with Prisma
- JWT access tokens and rotating refresh tokens in HttpOnly cookies
- Zod validation, bcrypt password hashing, and CORS with credentials

## Features

- registration, login, logout, and profile management;
- request creation, editing, filtering, and status tracking;
- volunteer assignments and completion feedback;
- administrator tools for users, requests, and assignments;
- protected routes with ownership and role checks;
- centralized validation and error handling.

## Start locally

```bash
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Configure `apps/backend/.env` and `apps/frontend/.env` from their `.env.example` files before starting the application. Detailed service notes are available in the backend and frontend README files.

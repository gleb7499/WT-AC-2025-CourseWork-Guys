# Bug Tracker "Not a Bug, It Is a Feature" (Variant 11)

A full-stack issue tracking system for projects, team members, bugs, comments, and attachments.

## Stack

- Frontend: React, TypeScript, Vite, React Router
- Backend: Express, TypeScript, Prisma
- Database: PostgreSQL
- Auth: JWT access/refresh tokens with rotation
- Security: bcrypt, Zod, Helmet, CORS, and HttpOnly cookies

## Features

- project creation and membership management;
- bug CRUD with priorities, statuses, comments, and attachments;
- project roles: owner, manager, developer, and viewer;
- global administrator role;
- ownership and permission matrix enforced by the API;
- access-token refresh and reuse detection.

## Quick start

```bash
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Configure `DATABASE_URL`, JWT secrets, and `VITE_API_URL` using the supplied environment examples. See the backend and frontend README files for service-specific details.

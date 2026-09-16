# News Aggregator "No Fake News" (Variant 37)

A full-stack news aggregation platform focused on trusted content, source management, moderation, and transparent publishing workflows.

## Technology

- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL with Prisma
- Authentication: JWT access and refresh tokens
- Validation and security: Zod, bcrypt, Helmet, CORS

## Core functionality

- public news feed with categories, tags, search, and pagination;
- user registration, login, profile, and role-based access;
- source and article management for authorized users;
- moderation workflow with statuses and audit-friendly updates;
- comments, reactions, and personal reading history;
- administrator controls for users and content.

## Local development

Install dependencies from the project root, configure the documented PostgreSQL connection and JWT secrets, then run migrations and seed data before starting the development server.

```bash
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

See the application source and environment examples in this directory for the exact scripts available in the current checkout.

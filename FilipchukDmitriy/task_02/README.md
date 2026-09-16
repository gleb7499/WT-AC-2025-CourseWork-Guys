# Collaborative Notes "Write Together" (Variant 16)

A full-stack monorepo for shared notebooks and collaborative note taking. The MVP combines notebooks, notes, labels, sharing, and revision history in a focused productivity workflow.

## Stack

- Backend: Express, TypeScript, Prisma, PostgreSQL
- Frontend: React, TypeScript, Vite
- Authentication: JWT access and rotating refresh tokens
- Validation: Zod

## Requirements

- Node.js 18+
- PostgreSQL available to Prisma

## Quick start

```bash
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Configure the backend and frontend environment files from the supplied examples. The application supports registration, login, notebook and note CRUD, labels, sharing, note history, and role-aware access control.

Detailed service documentation is available in `apps/backend/README.md` and `apps/frontend/README.md`.

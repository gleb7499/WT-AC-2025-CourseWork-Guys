# Progress Tracker (Variant 14)

A full-stack progress tracking application for organizing topics, setting goals, recording progress, and generating reports.

## Stack

- Backend: Express, TypeScript, Prisma, PostgreSQL
- Frontend: React, TypeScript, Vite
- Authentication: JWT access and rotating refresh tokens
- Validation: Zod

## Features

- topic catalog and goal management;
- progress entries with comments and timestamps;
- dashboards and reports by user and topic;
- `admin` and `user` roles;
- protected resources with ownership checks;
- automatic refresh after an expired access token.

## Start

```bash
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Create environment files from the examples before running migrations. Backend and frontend implementation notes are available in the nested README files.

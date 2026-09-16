# Request Management Platform (Variant 40)

A production-oriented full-stack system for collecting and processing requests through configurable forms, statuses, roles, and audit-friendly workflows.

## Product scope

- users submit requests through administrator-defined forms;
- moderators and administrators review requests and manage statuses;
- administrators configure forms, fields, and status flows;
- users can follow request history and status changes;
- attachments, validation, authentication, and role-aware access are included.

## Technology

- Frontend: React 18, TypeScript, Vite, React Router 7, React Hook Form, Zod
- Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL
- Security: JWT access/refresh rotation, bcrypt, Pino, Helmet, CORS
- Delivery: pnpm workspaces, Docker Compose, Kubernetes manifests, GitHub Actions

## Quick start

```bash
pnpm install
pnpm --filter @app/server prisma:generate
pnpm --filter @app/server prisma:migrate
pnpm --filter @app/server prisma:seed
pnpm dev
```

The backend runs on `http://localhost:3000` and the frontend on `http://localhost:5173` by default. Configure secrets and API URLs using the environment examples in `apps/server` and `apps/web`.

## Quality and deployment

The project includes unit, integration, and Playwright E2E tests, health and readiness endpoints, Docker development and production configurations, Kubernetes overlays, API documentation, and CI/CD automation. Detailed backend and frontend setup notes are available in the nested README files.

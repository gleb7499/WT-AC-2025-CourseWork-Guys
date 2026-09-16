# Backend Server - Request Management

REST API for the configurable request platform described in the parent README.

## Implemented functionality

- JWT authentication with access and rotating refresh tokens;
- `admin`, `moderator`, and `user` roles;
- administrator CRUD for request forms and statuses;
- request creation, editing, review, and status transitions;
- attachment uploads and status-change history;
- Zod validation and structured Pino logging;
- Prisma persistence with PostgreSQL;
- health and readiness endpoints.

## Run locally

```bash
pnpm install
pnpm --filter @app/server prisma:generate
pnpm --filter @app/server prisma:migrate
pnpm --filter @app/server prisma:seed
pnpm --filter @app/server dev
```

Create `apps/server/.env` from the example file. Configure `DATABASE_URL`, JWT secrets, `CORS_ORIGIN`, and token TTLs before starting the API.

## Tests

```bash
pnpm --filter @app/server test
pnpm --filter @app/server test:coverage
```

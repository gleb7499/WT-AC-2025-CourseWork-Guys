# Frontend - Request Management SPA

React 18 and Vite client for the configurable request platform.

## Technology

- React and TypeScript
- Vite and React Router 7
- React Hook Form and Zod
- Axios/Fetch API clients
- Lucide React and `clsx`

## Main flows

The SPA provides registration, login, protected routes, request submission, request history, form and status administration, moderator review, and role-aware navigation. Access tokens are stored in memory and refreshed through the backend's HttpOnly cookie flow.

## Run

```bash
pnpm install
pnpm dev:web
pnpm build
```

Create `apps/web/.env` and set `VITE_API_BASE_URL`, normally `http://localhost:3000`.

## E2E tests

```bash
pnpm --filter @app/web test:e2e
pnpm --filter @app/web test:e2e:ui
```

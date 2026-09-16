# Frontend SPA

React, TypeScript, and Vite client for the community support platform. The backend is the single source of truth for authentication, permissions, and application data.

## Run

From the repository root:

```bash
npm install
npm run dev -w frontend
```

Create `apps/frontend/.env` with:

```env
VITE_API_URL=http://localhost:4000
```

## Client responsibilities

The SPA provides public browsing, authentication screens, protected request workflows, volunteer assignment views, profile management, and administrator screens. API requests use the configured backend URL and credentials where refresh cookies are required.

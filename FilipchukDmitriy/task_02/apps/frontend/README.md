# Frontend - Collaborative Notes

React SPA for shared notebooks and notes.

## Technology

- React 18 and TypeScript
- Vite and React Router
- React Hook Form with Zod validation
- Fetch API with `credentials: include`

## Features

The UI includes authentication, protected routes, notebook and note management, labels, shared access, history browsing, and restore actions. Authentication keeps the access token in application state while the refresh token remains in an HttpOnly cookie managed by the backend.

## Run

From the monorepo root:

```bash
npm install
npm run dev:frontend
```

Configure the API URL in the frontend environment file when the backend is not running on its default local address.

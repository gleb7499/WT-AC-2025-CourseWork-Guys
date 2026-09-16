# Frontend - Progress Tracker

React and Vite SPA for topics, goals, progress entries, and reports.

## Technology

- React, TypeScript, and Vite
- React Router DOM
- React Hook Form and Zod
- Axios API client with refresh interceptor

## Implemented screens

Login, registration, dashboard, topics, goals, progress, and reports. Access tokens stay in application memory, while refresh tokens are handled by an HttpOnly cookie. On a 401 response the client refreshes the session and retries the original request.

## Run

```bash
npm install
npm run dev -w frontend
```

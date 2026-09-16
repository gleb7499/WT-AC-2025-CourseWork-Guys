# Frontend - Trip Planner SPA

React and Vite client for planning trips, tracking budgets, and sharing itineraries.

## Technology

- React 18 and TypeScript
- Vite and React Router DOM
- React Hook Form with Zod
- Axios API client

## User experience

The application provides login and registration, trip lists, trip details, stop management, notes, expenses, dates, participant sharing, and protected routes. The access token is kept in memory; refresh is handled through an HttpOnly cookie and an automatic retry after a 401 response.

## Run

```bash
npm install
npm run dev -w frontend
```

Set `VITE_API_URL` when the backend is hosted outside its default local address.

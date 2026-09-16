# Frontend - Room Booking SPA

React and Vite client for room availability and booking workflows.

## Requirements

- Node.js 18+
- backend running on the configured API URL (default: `http://localhost:3001`)

## Configuration and scripts

```bash
copy .env.example .env
npm run dev -w frontend
npm run build -w frontend
npm run preview -w frontend
```

Set `VITE_API_URL` when the backend uses a non-default URL. The UI includes authentication, room and schedule views, booking creation, cancellation, and rescheduling. Requests include credentials whenever the refresh cookie is needed.

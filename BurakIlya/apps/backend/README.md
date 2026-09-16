# Backend

REST API for the community support platform, built with Node.js, Express, TypeScript, PostgreSQL, and Prisma.

## Technology

- JWT authentication with short-lived access tokens and rotating refresh tokens;
- refresh tokens stored in HttpOnly cookies;
- bcrypt password hashing;
- Zod request validation;
- centralized error handling and CORS configuration;
- no Docker dependency for local development.

## Environment

Copy `.env.example` to `.env` and configure:

```env
PORT=4000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB?schema=public
CORS_ORIGIN=http://localhost:5173
JWT_ACCESS_SECRET=change-me
JWT_REFRESH_SECRET=change-me
```

## Run

```bash
npm install
npx prisma migrate dev
npm run seed
npm run dev
```

The API exposes authentication, user, request, assignment, and feedback endpoints. Access is enforced through authentication middleware, roles, and resource ownership checks.

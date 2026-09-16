# Backend - Bug Tracker

Express and Prisma REST API for the bug tracking application.

## Implemented functionality

- models: User, Project, ProjectMember, Bug, Attachment, Comment, and RefreshToken;
- JWT access/refresh authentication with rotation, reuse detection, and HttpOnly cookies;
- global `admin` role and project roles: owner, manager, developer, viewer;
- CRUD for projects, bugs, members, comments, and attachments;
- role-aware permissions and resource ownership checks;
- Zod validation, Helmet, CORS, and centralized error responses.

## Environment

Create `.env` from `.env.example` and configure:

- `DATABASE_URL`;
- `CORS_ORIGIN`;
- `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`;
- access and refresh token TTL values;
- optional refresh-cookie domain.

## Run

```bash
npm install
npx prisma migrate dev
npm run seed
npm run dev
```

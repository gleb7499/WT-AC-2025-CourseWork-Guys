# Backend - Collaborative Notes

Express and TypeScript API backed by Prisma and PostgreSQL.

## Implemented functionality

- models: User, Notebook, Note, Label, Share, RefreshToken, and NoteHistory;
- authentication endpoints for register, login, refresh, and logout;
- notebook, note, label, sharing, and history endpoints;
- access control for `user` and `admin` roles;
- ownership checks for private resources;
- JWT refresh rotation and reuse detection;
- Zod validation and readable API errors;
- bcrypt password hashing and CORS with credentials.

## Setup

```bash
npm install
copy .env.example .env
npx prisma migrate dev
npm run seed
npm run dev
```

Set `DATABASE_URL`, JWT secrets, and the frontend origin in `.env`. The API is intended to be run together with the frontend documented in the neighboring README.

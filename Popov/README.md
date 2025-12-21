# 🏫 Room Booking System - "Не занято?"

Production-ready room booking system for educational institutions. Book rooms before they're taken!

## 📋 Features

- **Room Management**: Browse, filter, and view available rooms
- **Smart Booking**: Create bookings with automatic conflict detection
- **Role-Based Access**: Different permissions for Students, Teachers, and Administrators
- **Schedule View**: Calendar view of all bookings
- **Time Limits**: Students (2 hours max), Teachers (4 hours max)
- **Admin Panel**: Full control over rooms, users, and bookings

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development)
- pnpm 8+ (for local development)

### Run with Docker (Recommended)

```bash
# Clone the repository
git clone <repo-url>
cd Popov

# Start all services
docker-compose up

# The application will be available at:
# - Frontend: http://localhost:5173
# - Backend API: http://localhost:3000
# - Health Check: http://localhost:3000/health
```

### Test Users

After running `docker-compose up`, the following test users are available:

| Username | Password | Role | Booking Limit |
|----------|----------|------|---------------|
| admin | Admin123! | Administrator | Unlimited |
| teacher | Teacher123! | Teacher | 4 hours |
| student | Student123! | Student | 2 hours |

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for development and building
- React Router v6 for navigation
- Zustand for state management
- Axios for API calls
- CSS Modules for styling

**Backend:**
- Node.js 20 + Express
- TypeScript (strict mode)
- Prisma ORM with PostgreSQL
- JWT authentication (access + refresh tokens)
- Zod for validation
- bcrypt for password hashing

**Database:**
- PostgreSQL 16

### Project Structure

```
Popov/
├── apps/
│   ├── server/          # Backend API
│   │   ├── src/
│   │   │   ├── routes/      # API route definitions
│   │   │   ├── controllers/ # HTTP request handlers
│   │   │   ├── services/    # Business logic
│   │   │   ├── middleware/  # Auth, validation, errors
│   │   │   ├── schemas/     # Zod validation schemas
│   │   │   └── lib/         # Utilities (prisma, jwt, errors)
│   │   └── prisma/          # Database schema and seeds
│   └── web/             # Frontend SPA
│       └── src/
│           ├── pages/       # Page components
│           ├── components/  # Reusable UI components
│           ├── features/    # Feature-specific logic
│           └── api/         # API client
├── task_01/             # R1 Documentation
└── docker-compose.yml   # Docker orchestration
```

## 📚 API Documentation

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get tokens
- `POST /api/auth/refresh` - Refresh access token

### Rooms

- `GET /api/rooms` - List all rooms (with filters)
- `POST /api/rooms` - Create room (admin only)
- `GET /api/rooms/:id` - Get room details
- `PUT /api/rooms/:id` - Update room (admin only)
- `DELETE /api/rooms/:id` - Delete room (admin only)

### Bookings

- `GET /api/bookings` - List bookings (with filters)
- `POST /api/bookings` - Create booking (conflict check)
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update/reschedule booking
- `DELETE /api/bookings/:id` - Cancel booking

### Schedule

- `GET /api/schedule` - View schedule by room/date
- `GET /api/schedule/conflicts` - Check for conflicts

### Users (Admin only)

- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user details
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🔒 Security

- JWT-based authentication with access and refresh tokens
- bcrypt password hashing (12 rounds)
- Rate limiting on authentication endpoints (5 attempts per 15 minutes)
- CORS configuration
- Helmet for HTTP header security
- Input validation with Zod on all endpoints
- Role-based access control

## 🛠️ Development

### Local Development Setup

```bash
# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Start PostgreSQL (or use Docker)
docker-compose up postgres

# Run database migrations
cd apps/server
pnpm db:push
pnpm db:seed

# Start backend (in one terminal)
cd apps/server
pnpm dev

# Start frontend (in another terminal)
cd apps/web
pnpm dev
```

### Available Scripts

**Root:**
- `pnpm dev` - Start all services in development mode
- `pnpm build` - Build all applications

**Server:**
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema to database
- `pnpm db:seed` - Seed database with test data

**Web:**
- `pnpm dev` - Start Vite dev server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build

## 📝 License

This project is created as a coursework for Web Technologies discipline.

## 👥 Author

Popov - Variant 02 - Room Booking System

FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Build stage
FROM base AS builder
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./
COPY apps/server/package.json ./apps/server/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY apps/server ./apps/server

# Generate Prisma client
WORKDIR /app/apps/server
RUN pnpm db:generate

# Build
RUN pnpm build

# Production stage
FROM base AS runner
WORKDIR /app

# Copy built files
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/prisma ./prisma
COPY --from=builder /app/apps/server/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Generate Prisma client
RUN pnpm db:generate

EXPOSE 3000

CMD ["node", "dist/index.js"]

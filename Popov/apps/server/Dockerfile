FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS builder
WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/

# Install dependencies from root
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/server ./apps/server

# Generate Prisma client and build
WORKDIR /app/apps/server
RUN pnpm db:generate
RUN pnpm build

FROM base AS runner
WORKDIR /app

# Copy node_modules and built files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/server/node_modules ./apps/server/node_modules
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/apps/server/prisma ./apps/server/prisma
COPY --from=builder /app/apps/server/package.json ./apps/server/

WORKDIR /app/apps/server

EXPOSE 3000

CMD ["node", "dist/index.js"]

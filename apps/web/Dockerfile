# syntax = docker/dockerfile:1

# Next.js Web Application - User-facing journaling app

ARG NODE_VERSION=22.14.0
FROM node:${NODE_VERSION}-slim AS base

LABEL app="postscript-web"
LABEL description="Next.js web application for journaling prompts"

WORKDIR /app

# Build stage
FROM base AS build

ENV NODE_ENV="production"

# Install build dependencies
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp openssl pkg-config python-is-python3 && \
    rm -rf /var/lib/apt/lists/*

# Copy workspace files
COPY package.json package-lock.json turbo.json ./
COPY apps/web ./apps/web
COPY packages ./packages

# Install dependencies
RUN npm ci --include=dev

# Generate Prisma Client
RUN npx prisma generate --schema=./packages/prisma/schema.prisma

# Build Next.js app
WORKDIR /app/apps/web
RUN npm run build

# Production stage
FROM base

ENV NODE_ENV="production"

# Install runtime dependencies
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built Next.js application
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build /app/apps/web/public ./apps/web/public
COPY --from=build /app/packages/prisma ./packages/prisma

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); });"

EXPOSE 3001

# Next.js standalone server
CMD ["node", "apps/web/server.js"]

# syntax = docker/dockerfile:1

# NestJS Scheduler API - Background service for sending daily prompt emails

ARG NODE_VERSION=22.14.0
FROM node:${NODE_VERSION}-slim AS base

LABEL app="postscript-api"
LABEL description="NestJS scheduler for daily prompt emails"

WORKDIR /app

ENV NODE_ENV="production"

# Build stage
FROM base AS build

# Install build dependencies
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp openssl pkg-config python-is-python3 && \
    rm -rf /var/lib/apt/lists/*

# Copy workspace files
COPY package.json package-lock.json turbo.json ./
COPY apps/api ./apps/api
COPY packages ./packages

# Install dependencies
RUN npm ci --include=dev

# Generate Prisma Client
RUN npx prisma generate --schema=./packages/prisma/schema.prisma

# Build the API
WORKDIR /app/apps/api
RUN npm run build

# Production stage
FROM base

# Add non-root user for security
RUN addgroup --gid 1001 nodejs
RUN adduser --uid 1001 --gid 1001 --disabled-password --gecos "" nestjs

# Install runtime dependencies
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl && \
    rm -rf /var/lib/apt/lists/*

# Copy built application
COPY --from=build --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=build --chown=nestjs:nodejs /app/apps/api/package.json ./package.json
COPY --from=build --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nestjs:nodejs /app/packages/prisma ./packages/prisma

# Switch to non-root user
USER nestjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); });"

EXPOSE 3000

CMD [ "node", "dist/main" ]

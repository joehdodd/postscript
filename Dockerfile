# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=22.14.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="NestJS/Prisma"

# NestJS/Prisma app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp openssl pkg-config python-is-python3

# Copy root package.json and necessary workspace packages
COPY package.json ./
COPY apps/api ./apps/api
COPY packages ./packages

# Install all dependencies from root (to resolve @repo/* workspace packages)
RUN npm install --include=dev

# Generate Prisma Client
RUN npx prisma generate --schema=./packages/prisma/schema.prisma

# Build the API application
WORKDIR /app/apps/api
RUN npm run build


# Final stage for app image
FROM base

# Install packages needed for deployment
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy built application and necessary files
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages/prisma ./packages/prisma

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "node", "dist/main" ]

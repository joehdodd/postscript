# Docker Deployment Guide

This monorepo contains two independently deployable applications:
- **Web App** (Next.js) - User-facing journaling interface
- **API** (NestJS) - Background scheduler for daily prompt emails

## Quick Start - Local Development

1. **Start all services** (database + both apps):
```bash
docker compose up --build
```

2. **Run database migrations**:
```bash
# Wait for postgres to be ready, then:
docker exec -it postscript-db psql -U postgres -d postscript -c "SELECT 1;"

# Run migrations from host machine
cd packages/prisma
npx prisma migrate deploy
```

3. **Access the apps**:
- Web: http://localhost:3001
- API: http://localhost:3000
- Database: localhost:5433

## Build Individual Apps

### Web App Only
```bash
docker build -f apps/web/Dockerfile -t postscript-web .
docker run -p 3001:3001 \
  -e DATABASE_URL="postgresql://..." \
  -e MAGIC_LINK_SECRET="..." \
  postscript-web
```

### API Only
```bash
docker build -f apps/api/Dockerfile -t postscript-api .
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e MAGIC_LINK_SECRET="..." \
  -e RESEND_API_KEY="..." \
  postscript-api
```

## Production Deployment

### Web App (Vercel/Netlify - Recommended)
The web app is optimized for serverless deployment:
- No Docker needed
- Vercel auto-detects Next.js apps
- Connect to your Postgres database via DATABASE_URL

### API (Fly.io/Railway - Recommended)
The API scheduler runs as a long-lived container:

**Fly.io:**
```bash
cd apps/api
fly launch
fly secrets set DATABASE_URL="..." MAGIC_LINK_SECRET="..." RESEND_API_KEY="..."
fly deploy
```

**Railway:**
```bash
# Use apps/api/Dockerfile
# Set environment variables in Railway dashboard
```

## Environment Variables

Both apps require:
- `DATABASE_URL` - PostgreSQL connection string
- `MAGIC_LINK_SECRET` - JWT secret for auth tokens

API only requires:
- `RESEND_API_KEY` - For sending emails
- `WEB_APP_URL` - URL of the web app (for magic links)

## Architecture

```
┌─────────────────┐
│   Web App       │  ← Users interact here
│   (Next.js)     │  ← Can scale independently
│   Port 3001     │  ← Deploys frequently
└────────┬────────┘
         │
         ├─────► PostgreSQL Database
         │       (Shared)
         │
┌────────┴────────┐
│   API           │  ← Background scheduler
│   (NestJS)      │  ← Rarely changes
│   Port 3000     │  ← Sends daily emails
└─────────────────┘
```

## Troubleshooting

**Database connection issues:**
- Ensure DATABASE_URL includes `?schema=public`
- Check postgres container is healthy: `docker ps`

**Build fails:**
- Clear Docker cache: `docker system prune -a`
- Ensure node_modules are not copied: check .dockerignore

**Port conflicts:**
- Change ports in docker-compose.yml
- Update DATABASE_URL to match new port

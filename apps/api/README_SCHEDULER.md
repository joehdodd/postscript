# Postscript API (Scheduler Only)

This NestJS application has been simplified to handle **background scheduling only**. All user-facing operations are now handled by the Next.js app with direct Prisma access.

## Architecture

### What This API Does
- ✅ Sends scheduled daily prompt emails to users
- ✅ Generates magic link tokens for email authentication
- ✅ Creates prompts in the database

### What It Doesn't Do (Moved to Next.js)
- ❌ No REST API endpoints for auth, prompts, or entries
- ❌ No user-facing request handling
- ❌ All CRUD operations now in Next.js Server Actions

## Modules

### SchedulerModule
- **SchedulerService**: Cron job that runs daily at 9:00 AM
- Fetches all users with 'daily' frequency
- Sends prompt emails via EmailService

### EmailModule
- **EmailService**: Self-contained email sending service
  - Creates prompts in database
  - Generates JWT magic link tokens
  - Sends emails via Resend API

## Environment Variables

Required `.env` variables:

```bash
# Database
DATABASE_URL="postgresql://..."

# Magic Link Authentication
MAGIC_LINK_SECRET="your-secret-key"

# Email Service (Resend)
RESEND_API_KEY="re_..."

# Next.js App URL (for magic links)
WEB_APP_URL="http://localhost:3001"
```

## Development

Start the scheduler:
```bash
npm run dev
```

The scheduler will:
1. Run daily at 9:00 AM (configured via @Cron decorator)
2. Find all users with 'daily' frequency
3. Generate a prompt for each user
4. Send email with magic link

## Scheduled Jobs

### Daily Prompts
- **Schedule**: Every day at 9:00 AM
- **Service**: `SchedulerService.sendDailyPrompts()`
- **Prompt Strategy**: Currently using rotating prompts from hardcoded list
  - TODO: Implement proper prompt generation strategy

## Deployment

This app should run as a separate container from Next.js:
- **Next.js**: User-facing web app (port 3001)
- **NestJS**: Background scheduler (port 3000)

Both can run independently and share the same PostgreSQL database via Prisma.

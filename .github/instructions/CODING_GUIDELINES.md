# Postscript Coding Guidelines

## Project Overview
**Postscript** is a journaling application that sends users magic link emails with writing prompts. Users authenticate via email, receive prompts, and can write entries in response.

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeScript, Prisma ORM
- **Database**: PostgreSQL
- **Email**: Resend API
- **Authentication**: JWT-based magic links
- **Styling**: Tailwind CSS with custom color palette

---

## Code Organization & Architecture

### Monorepo Structure
```
apps/
  api/          # NestJS backend
  web/          # Next.js frontend
packages/
  api/          # Shared API types
  ui/           # Shared UI components
```

### Component Architecture
- **Keep components under 200 lines** - Extract into smaller, focused components when exceeded
- Use **single responsibility principle** - each component should have one clear purpose
- Prefer **composition over large monolithic components**
- Extract reusable logic into custom hooks or utility functions

---

## Next.js 15 Specific Guidelines

### App Router Patterns
```typescript
// ✅ Correct: Handle Promise-based params in Next.js 15
type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  // ...
}

// ❌ Incorrect: Treating params as synchronous object
export default function Page({ params }: { params: { id: string } }) {
  // This will cause build errors in Next.js 15
}
```

### Server vs Client Components
- **Default to Server Components** for data fetching and static content
- Use **Client Components** only when you need:
  - Event handlers (`onClick`, `onChange`, etc.)
  - Browser APIs (`localStorage`, `window`, etc.)
  - State management (`useState`, `useEffect`, etc.)
- Mark Client Components with `"use client"` directive at the top

### Authentication Pattern
```typescript
// ✅ Use server actions for auth checks
import { requireAuth } from '../../actions/auth';

export default async function ProtectedPage() {
  const { userId } = await requireAuth();
  if (!userId) {
    redirect('/');
  }
  // Component logic...
}
```

### Data Fetching
- Use **server actions** for data operations
- Fetch data in parallel when possible using `Promise.all()`
- Handle loading and error states appropriately

---

## Styling Guidelines

### Tailwind CSS First Approach
**ALWAYS use Tailwind utility classes** instead of inline styles or CSS-in-JS unless absolutely necessary.

```typescript
// ✅ Preferred: Tailwind classes
<div className="bg-ps-primary-500 p-6 rounded-lg border shadow-md">

// ❌ Avoid: Inline styles (use only as last resort)
<div style={{ backgroundColor: 'var(--ps-primary-500)' }}>
```

### Custom Color Palette
Use the **Postscript color system** defined in `globals.css`:

```css
/* Color Palette Structure */
--ps-primary-50 through --ps-primary-900    /* Ocean blues */
--ps-secondary-50 through --ps-secondary-900 /* Forest greens */
--ps-accent-50 through --ps-accent-900       /* Terracotta */
--ps-neutral-50 through --ps-neutral-900     /* Grays */
```

**Tailwind Class Naming:**
- `bg-ps-primary-500`, `text-ps-secondary`, `border-ps-accent-300`
- Always use semantic color names, not arbitrary values

### Responsive Design
- Use Tailwind responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Mobile-first approach: base styles for mobile, larger screens as additions
- Test on multiple screen sizes

---

## NestJS Backend Guidelines

### Module Structure
```typescript
// ✅ Follow NestJS module pattern
@Module({
  imports: [PrismaModule],
  controllers: [SomeController],
  providers: [SomeService],
  exports: [SomeService],
})
export class SomeModule {}
```

### Service Layer Pattern
- Keep **business logic in services**, not controllers
- Controllers should only handle HTTP concerns (validation, routing, responses)
- Use dependency injection properly

### Database & Prisma
- Use **Prisma schema** for database modeling
- Run `prisma migrate dev` after schema changes
- Use **Prisma Client** for type-safe database operations
- Handle connection pooling and error states

### Email Integration
```typescript
// ✅ Email service pattern with Resend
@Injectable()
export class EmailService {
  async sendMagicLink(email: string, token: string) {
    // Use branded HTML templates
    // Handle environment variables properly
    // Include error handling
  }
}
```

---

## Security Best Practices

### Authentication
- **Never hardcode secrets** - use environment variables with proper validation
- Use **JWT tokens** with appropriate expiration times
- Validate **all user inputs** server-side
- Implement **proper error handling** without exposing sensitive info

### Environment Variable Validation
```typescript
// ✅ Always validate environment variables with helper functions
function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} environment variable is not set`);
  }
  return value;
}

// ✅ Use specific validation functions for different secrets
function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  return url;
}

function getMagicLinkSecret(): string {
  const secret = process.env.MAGIC_LINK_SECRET;
  if (!secret) {
    throw new Error('MAGIC_LINK_SECRET environment variable is not set');
  }
  return secret;
}

// ❌ Avoid: Direct access without validation
const secret = process.env.JWT_SECRET; // Could be undefined!
```

### Magic Link Implementation
```typescript
// ✅ Secure magic link pattern with proper secret validation
function getMagicLinkSecret(): string {
  const secret = process.env.MAGIC_LINK_SECRET;
  if (!secret) {
    throw new Error('MAGIC_LINK_SECRET environment variable is not set');
  }
  return secret;
}

const token = jwt.sign(
  { userId, email, type: 'magic-link' },
  getMagicLinkSecret(),
  { expiresIn: '15m' }
);
```

---

## TypeScript Guidelines

### Type Safety
- **Define proper types** for all props and function parameters
- Use **strict TypeScript config**
- Avoid `any` type - use proper typing or `unknown` with type guards
- Export types for shared use across components

### Props Typing
```typescript
// ✅ Proper component typing
type ComponentProps = {
  title: string;
  isOptional?: boolean;
  onAction: (id: string) => void;
};

export default function Component({ title, isOptional = false, onAction }: ComponentProps) {
  // Component logic
}
```

---

## Performance Guidelines

### Optimization Strategies
- Use **React Server Components** for better initial page loads
- Implement **proper caching** strategies
- Optimize **database queries** (select only needed fields)
- Use **dynamic imports** for large client-side components

### Bundle Optimization
- Keep **client-side JavaScript minimal**
- Use **tree shaking** effectively
- Implement **code splitting** for large features

---

## Error Handling

### Frontend Error Handling
```typescript
// ✅ Proper error boundaries and user feedback
try {
  const result = await serverAction();
  // Handle success
} catch (error) {
  // Log error, show user-friendly message
  console.error('Action failed:', error);
}
```

### Backend Error Handling
- Use **NestJS exception filters** for consistent error responses
- Log errors appropriately without exposing sensitive data
- Return **meaningful error messages** to the frontend

---

## Testing Guidelines

### Component Testing
- Test **component behavior**, not implementation details
- Use **React Testing Library** for component tests
- Mock **external dependencies** properly

### API Testing
- Test **all endpoints** with proper input validation
- Use **Jest** for unit and integration tests
- Test **error scenarios** as well as happy paths

---

## File and Folder Naming

### Conventions
- Use **PascalCase** for component files: `PromptHeader.tsx`
- Use **camelCase** for utility files: `formatDate.ts`
- Use **kebab-case** for route segments: `/apps/web/app/magic-link/`
- Keep file names **descriptive** and specific

### Import Organization
```typescript
// ✅ Import order
// 1. React/Next.js imports
import { redirect } from 'next/navigation';
import Link from 'next/link';

// 2. Third-party libraries
import { format } from 'date-fns';

// 3. Internal imports (actions, components, utils)
import { requireAuth } from '../../actions/auth';
import PromptHeader from '../../components/PromptHeader';
import { formatDate } from '../../utils/dateUtils';
```

---

## Git and Development Workflow

### Commit Messages
- Use **descriptive commit messages**
- Follow conventional commits when possible
- Group related changes in single commits

### Branch Strategy
- Use **feature branches** for new development
- Keep **main branch** stable and deployable
- Use **meaningful branch names**: `feature/prompt-response-ui`

---

## Documentation

### Code Documentation
- Write **clear comments** for complex business logic
- Use **JSDoc** for exported functions and components
- Keep **README files** updated with setup instructions

### API Documentation
- Document **all endpoints** with proper examples
- Include **request/response schemas**
- Maintain **up-to-date Swagger/OpenAPI** specs

---

## Environment and Configuration

### Environment Variables
```bash
# ✅ Required environment variables
DATABASE_URL=
JWT_SECRET=
RESEND_API_KEY=
NEXT_PUBLIC_API_URL=
```

### Configuration Management
- Use **separate configs** for development/production
- Validate **environment variables** at startup
- Use **type-safe environment configs** when possible

---

## Deployment Considerations

### Production Readiness
- Ensure **proper error logging**
- Implement **health checks** for services
- Use **database connection pooling**
- Set up **proper CORS** configuration
- Configure **rate limiting** for API endpoints

### Performance Monitoring
- Implement **logging** for debugging
- Monitor **database query performance**
- Track **frontend core web vitals**
- Set up **error tracking** (e.g., Sentry)

---

*This document should be referenced for all new feature development and code reviews to maintain consistency across the Postscript codebase.*
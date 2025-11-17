<!--
Sync Impact Report:
Version: 0.0.0 → 1.0.0
Date: 2025-11-17

Changes:
- Initial constitution ratification for Postscript project
- Established 7 core principles for monorepo TypeScript development
- Defined security, architecture, and development workflow standards
- All templates reviewed and aligned with constitution requirements

Modified Principles: N/A (initial version)
Added Sections: All (initial version)
Removed Sections: N/A

Templates Status:
✅ plan-template.md - Constitution Check section aligns with principles
✅ spec-template.md - User scenarios and requirements align with principles
✅ tasks-template.md - Task organization and testing approach align with principles

Follow-up TODOs: None
-->

# Postscript Constitution

## Core Principles

### I. Monorepo Modularity

**MUST** maintain clean separation between apps (`api`, `web`) and shared packages (`@repo/*`). Each package MUST be independently usable with clear public APIs. Circular dependencies between packages are PROHIBITED. Apps MAY depend on packages, but packages MUST NOT depend on apps.

**Rationale**: Prevents tight coupling, enables parallel development, simplifies testing, and allows future extraction of packages into standalone libraries if needed.

### II. Type Safety First

TypeScript strict mode MUST be enabled for all projects. The `any` type is PROHIBITED except when interfacing with untyped third-party libraries (document with `// @ts-expect-error` and justification). All API boundaries (props, function parameters, server actions, API endpoints) MUST have explicit types. Shared types MUST live in appropriate packages (`@repo/api`, `@repo/ui`).

**Rationale**: Type safety catches errors at compile time, improves IDE support, serves as living documentation, and prevents entire classes of runtime bugs in production.

### III. Component Size Discipline

React components MUST NOT exceed 200 lines. When approaching this limit, extract into smaller components or custom hooks following single responsibility principle. Large components MUST be refactored before adding new features. Server Components are preferred; Client Components (`"use client"`) only when interactive features (state, events, browser APIs) are required.

**Rationale**: Smaller components are easier to understand, test, maintain, and reuse. Forces developers to think about composition and separation of concerns.

### IV. Security By Default

**NON-NEGOTIABLE**: Environment variables MUST be validated at application startup using dedicated validation functions (never direct `process.env` access for secrets). Magic link tokens MUST expire within 15 minutes. All user inputs MUST be validated server-side. Error messages MUST NOT expose sensitive information (stack traces, database details, secrets). JWT secrets, API keys, and database URLs MUST use environment-specific values with no fallback defaults in production.

**Rationale**: Security cannot be retrofitted. Validation at startup prevents runtime failures in production. Short-lived tokens minimize breach windows. These rules prevent the most common security vulnerabilities in web applications.

### V. Server-First Architecture

Data fetching and authentication MUST happen in Server Components or Server Actions. Client-side JavaScript MUST be minimized—only use Client Components when interactivity requires it. Magic link authentication and session management MUST be handled server-side. Database queries (Prisma) MUST only execute on the server (never expose Prisma Client to browser bundles).

**Rationale**: Server-first reduces bundle size, improves performance, enhances security (credentials never in browser), and leverages Next.js 15 App Router optimizations.

### VI. Tailwind-First Styling

Styling MUST use Tailwind utility classes and the project's custom color palette (`--ps-primary-*`, `--ps-secondary-*`, `--ps-accent-*`, `--ps-neutral-*`). Inline styles are PROHIBITED except for dynamic values that cannot be achieved with Tailwind (document why). All colors MUST use semantic palette variables, never hardcoded hex codes. Responsive design MUST follow mobile-first approach.

**Rationale**: Consistent styling system, predictable class names, reduced CSS bundle size, easier theme management, and design system enforcement through tooling.

### VII. Explicit Over Implicit

File paths in task descriptions MUST be absolute and complete (e.g., `apps/web/app/login/page.tsx`). Feature specs MUST define success criteria and edge cases before implementation. Database schema changes MUST include migration files. API contracts MUST be documented before implementation. Breaking changes MUST be flagged and documented.

**Rationale**: Reduces ambiguity, prevents miscommunication, creates audit trail, and enables automated tooling validation.

## Security Requirements

### Authentication & Authorization
- Magic link tokens MUST use JWT with `MAGIC_LINK_SECRET` environment variable
- Token expiration MUST be enforced (max 15 minutes for authentication)
- Session cookies MUST be `httpOnly`, `secure` (in production), and `sameSite: 'lax'`
- User authentication MUST use the `requireAuth()` server action pattern
- Password storage is PROHIBITED (magic link only authentication)

### Environment Variable Handling
```typescript
// REQUIRED pattern for all secrets:
function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} environment variable is not set`);
  }
  return value;
}
```

### Data Protection
- User emails MUST be unique and indexed in database
- PII (personally identifiable information) MUST NOT be logged
- Error messages to clients MUST be generic; detailed errors only in server logs
- Database connection strings MUST use SSL in production

## Architecture Standards

### Monorepo Structure
```
apps/
  api/          # NestJS backend (scheduler, manual email endpoints)
  web/          # Next.js 15 frontend (App Router)
packages/
  @repo/api     # Shared API types/DTOs
  @repo/ui      # Shared React components
  @repo/prisma  # Database schema and client
  @repo/eslint-config
  @repo/jest-config
  @repo/typescript-config
```

### Technology Stack (MUST follow versions)
- **Frontend**: Next.js 15 (App Router required), React 19, TypeScript 5.x, Tailwind CSS
- **Backend**: NestJS 10+, TypeScript 5.x, Prisma ORM 5+
- **Database**: PostgreSQL (Neon in production)
- **Email**: Resend API (official SDK)
- **Monorepo**: Turborepo 2.x, npm workspaces
- **Node**: >= 18.x

### Database & ORM
- Prisma schema MUST be the source of truth for data models
- Migrations MUST be created with `prisma migrate dev`
- Direct SQL is PROHIBITED (use Prisma Client methods)
- Database queries MUST select only required fields (no `SELECT *` equivalents)

## Development Workflow

### Feature Development Lifecycle
1. **Specification Phase**: Create feature spec in `.specify/specs/[###-feature-name]/spec.md` using spec-template.md
2. **Planning Phase**: Generate implementation plan with constitution check using plan-template.md
3. **Task Breakdown**: Create tasks.md organized by user story priority (P1, P2, P3)
4. **Implementation**: Implement in priority order; each user story MUST be independently testable
5. **Validation**: Verify constitution compliance before PR

### Code Quality Gates
- All TypeScript MUST compile with zero errors (`tsc --noEmit`)
- Linting MUST pass (`turbo run lint`)
- Formatting MUST be consistent (`prettier --check`)
- Constitution violations MUST be documented in `plan.md` Complexity Tracking section with justification

### Naming Conventions
- **Components**: PascalCase (`PromptHeader.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Routes**: kebab-case (`/magic-link/`)
- **Database fields**: camelCase (`userId`, `createdAt`)
- **Environment variables**: SCREAMING_SNAKE_CASE (`MAGIC_LINK_SECRET`)

### Import Organization (enforced order)
```typescript
// 1. React/Next.js
import { redirect } from 'next/navigation';
// 2. Third-party libraries
import { format } from 'date-fns';
// 3. Internal imports
import { requireAuth } from '@/app/actions/auth';
```

### Git Workflow
- Feature branches MUST follow: `feature/[###-feature-name]`
- Commit messages SHOULD follow conventional commits
- Main branch MUST always be deployable
- Breaking changes MUST be documented in commit message body

## Governance

This constitution supersedes all other coding practices and guidelines. Any deviation MUST be justified in the implementation plan's "Complexity Tracking" section.

### Amendment Process
1. Propose change in writing with rationale
2. Document impact on existing templates and codebase
3. Update version following semantic versioning:
   - **MAJOR**: Breaking governance changes (remove/redefine principles)
   - **MINOR**: New principles or significant expansions
   - **PATCH**: Clarifications, typos, non-semantic refinements
4. Update all affected templates before amendment takes effect
5. Create sync impact report documenting changes

### Compliance Review
- All feature plans MUST pass constitution check before Phase 0 research
- Pull requests MUST reference which principles they follow
- Complexity violations MUST be documented and approved
- Constitution alignment is verified at each phase gate

### Runtime Guidance
For agent-specific development guidance and detailed coding patterns, refer to `.github/instructions/CODING_GUIDELINES.md`. That document provides implementation details and examples; this constitution provides the non-negotiable rules.

**Version**: 1.0.0 | **Ratified**: 2025-11-17 | **Last Amended**: 2025-11-17

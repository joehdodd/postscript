# Security Remediation Plan

## Executive Summary

This document outlines critical security vulnerabilities discovered during a comprehensive security audit of the Postscript application. **The application is currently NOT production-ready** due to multiple critical and high-severity security issues that must be addressed immediately.

**Risk Level: CRITICAL** - Immediate action required before any production deployment.

## Critical Vulnerabilities Overview

- **15+ security vulnerabilities** identified across authentication, input validation, infrastructure, and data protection
- **5 Critical severity** issues requiring immediate fixes
- **6 High severity** issues requiring fixes within 1 week
- **4 Medium severity** issues requiring fixes within 1 month

## Phase 1: Emergency Security Fixes (Complete within 48 hours)

### 1.1 Critical Authentication Vulnerabilities

#### Fix 1: Remove JWT Token Logging
**File:** `apps/web/lib/auth.ts`
**Issue:** JWT tokens are logged to console, exposing them in logs
**Risk:** Token compromise, session hijacking

```typescript
// REMOVE THIS LINE:
console.log('Generated token:', token);
```

#### Fix 2: Fix Middleware Authentication Bypass
**File:** `apps/web/proxy.ts`
**Issue:** Missing `await` allows authentication bypass
**Risk:** Complete authentication bypass

```typescript
// CHANGE THIS:
const user = validateTokenForMiddleware(token);

// TO THIS:
const user = await validateTokenForMiddleware(token);
```

#### Fix 3: Fix Prisma in Edge Runtime
**File:** `apps/web/proxy.ts`
**Issue:** Prisma cannot run in Edge Runtime
**Risk:** Application crashes, authentication failures

Solution: Move to Node.js runtime or use edge-compatible database client.

### 1.2 Critical API Route Security

#### Fix 4: Secure Unprotected API Routes
**Files:** Multiple API routes lack authentication
**Issue:** API endpoints accessible via CURL/Postman without authentication
**Risk:** Unauthorized access, data manipulation, service abuse

**CRITICAL GAPS FOUND:**
- `apps/web/app/api/account/update/route.ts` - No authentication check
- `apps/api/src/email/email.controller.ts` - No authentication required
- Missing API middleware for route protection

**Fix Implementation:**

1. **Add API Authentication to proxy.ts** (apps/web/proxy.ts):
```typescript
// Add API route protection to existing proxy logic
if (request.nextUrl.pathname.startsWith('/api/')) {
  // Skip webhook endpoints (they use signature verification)
  if (request.nextUrl.pathname.startsWith('/api/stripe/webhooks')) {
    return NextResponse.next();
  }
  
  // Require authentication for all other API routes
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  
  const user = await validateTokenForMiddleware(token);
  if (!user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
  
  // Add user info to request headers for API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', user.userId);
  requestHeaders.set('x-user-email', user.email);
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
```

2. **Update Unprotected Account API** (apps/web/app/api/account/update/route.ts):
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { updateAccountInformation } from '../../../actions/account';
import { requireAuth } from '../../../actions/auth';

export async function POST(request: NextRequest) {
  try {
    // Add authentication check
    const { userId } = await requireAuth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // Ensure user can only update their own account
    if (data.userId && data.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const result = await updateAccountInformation({ ...data, userId });
    // ... rest of implementation
  } catch (error) {
    // ... error handling
  }
}
```

3. **Secure NestJS Email API** (apps/api/src/email/email.controller.ts):
```typescript
import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Headers } from '@nestjs/common';
import { EmailService } from './email.service';

// Add API key guard
@UseGuards(ApiKeyGuard)
@Controller('email')
export class EmailController {
  @Post('send-prompt')
  @HttpCode(HttpStatus.OK)
  async sendPrompt(
    @Body() body: { email: string; prompt?: string; userId: string },
    @Headers('authorization') auth: string,
  ) {
    // Validate API key or JWT token
    if (!this.isValidApiKey(auth)) {
      throw new UnauthorizedException('Invalid API key');
    }
    
    // ... rest of implementation
  }
}
```

#### Fix 5: Implement Input Validation for API Routes
**Files:** All API endpoints
**Issue:** No input validation on API endpoints
**Risk:** XSS attacks, data corruption, injection attacks

```typescript
// ADD THIS VALIDATION TO ALL API ROUTES:
import { z } from 'zod';

const updateAccountSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  // ... other fields
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await requireAuth();
    const data = await request.json();
    
    // Validate input schema
    const validatedData = updateAccountSchema.parse(data);
    
    // ... continue with validated data
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    // ... other error handling
  }
}
```

#### Fix 6: Remove Hardcoded Database Credentials
**File:** `packages/prisma/schema.prisma` and environment configuration
**Issue:** Database credentials exposed in codebase
**Risk:** Database compromise

Move all credentials to environment variables and update schema.

### 1.3 Critical Infrastructure Security

#### Fix 6: Enable Container Security
**File:** `Dockerfile` (both apps)
**Issue:** Running as root user
**Risk:** Container escape, privilege escalation

```dockerfile
# ADD THESE LINES:
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# CHANGE FROM:
USER root

# TO:
USER nextjs
```

## Phase 2: High-Priority Security Hardening (Complete within 1 week)

### 2.1 Authentication Hardening

#### Fix 7: Implement Token Refresh
**File:** `apps/web/lib/auth.ts`
**Issue:** No token refresh mechanism
**Implementation:** Add refresh token flow with shorter access token expiry

#### Fix 8: Add Rate Limiting
**Files:** API routes and authentication endpoints
**Issue:** No rate limiting on sensitive operations
**Implementation:** Add rate limiting middleware

### 2.2 API Security

#### Fix 9: Implement CORS Security
**Files:** Next.js config and NestJS main.ts
**Issue:** Missing CORS configuration allows unauthorized cross-origin requests
**Implementation:**

```typescript
// apps/web/next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.ALLOWED_ORIGINS || 'https://yourdomain.com',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
          },
        ],
      },
    ];
  },
};

// apps/api/src/main.ts
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://yourdomain.com'],
  credentials: true,
});
```

#### Fix 10: Implement API Rate Limiting
**Files:** API middleware and NestJS guards
**Issue:** No rate limiting on API endpoints
**Implementation:**

```typescript
// For Next.js API routes - add middleware
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
});

// Add to API routes:
const { success } = await ratelimit.limit(
  request.ip ?? request.headers.get('x-forwarded-for') ?? 'anonymous'
);

if (!success) {
  return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
}
```

#### Fix 11: Add API Request/Response Logging
**Files:** All API endpoints
**Issue:** No audit trail for API access
**Implementation:**

```typescript
// Add to all API routes
console.log(`API ${request.method} ${request.url} - User: ${userId} - IP: ${request.ip} - Time: ${new Date().toISOString()}`);
```

#### Fix 12: Implement Input Validation Schema
**Files:** All API endpoints
**Issue:** Inconsistent input validation
**Implementation:** Use Zod or similar for schema validation

#### Fix 10: Add Security Headers
**File:** `next.config.js`
**Issue:** Missing security headers
**Implementation:**

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
};
```

### 2.3 Data Protection

#### Fix 11: Implement Query Parameterization
**Files:** All Prisma queries
**Issue:** Potential SQL injection
**Implementation:** Review and ensure all queries use parameterized statements

#### Fix 12: Add Data Encryption
**Files:** Sensitive data fields
**Issue:** Sensitive data stored in plaintext
**Implementation:** Encrypt PII and sensitive fields

## Phase 3: Compliance and Monitoring (Complete within 1 month)

### 3.1 Privacy and Compliance

#### Fix 13: GDPR Compliance Implementation
**Files:** Privacy policy, data handling procedures
**Issue:** No GDPR compliance measures
**Implementation:**
- Add privacy policy
- Implement data export/deletion
- Add consent management

#### Fix 14: Audit Logging
**Files:** All critical operations
**Issue:** No audit trail
**Implementation:** Add comprehensive audit logging

### 3.2 Monitoring and Alerting

#### Fix 15: Security Monitoring
**Implementation:**
- Add security event monitoring
- Implement anomaly detection
- Set up security alerts

## Implementation Priority Matrix

| Phase | Fix | Priority | Estimated Hours | Risk Level |
|-------|-----|----------|----------------|------------|
| 1 | Token Logging Removal | P0 | 1 | Critical |
| 1 | Middleware Auth Fix | P0 | 2 | Critical |
| 1 | Prisma Edge Runtime | P0 | 4 | Critical |
| 1 | API Route Authentication | P0 | 6 | Critical |
| 1 | API Input Validation | P0 | 8 | Critical |
| 1 | Credential Removal | P0 | 2 | Critical |
| 1 | Container Security | P0 | 3 | Critical |
| 2 | Token Refresh | P1 | 12 | High |
| 2 | CORS Configuration | P1 | 4 | High |
| 2 | API Rate Limiting | P1 | 8 | High |
| 2 | API Audit Logging | P1 | 6 | High |
| 2 | Validation Schema | P1 | 16 | High |
| 2 | Security Headers | P1 | 4 | High |
| 2 | Query Parameterization | P1 | 8 | High |
| 2 | Data Encryption | P1 | 20 | High |
| 3 | GDPR Compliance | P2 | 40 | Medium |
| 3 | Audit Logging | P2 | 24 | Medium |
| 3 | Security Monitoring | P2 | 32 | Medium |

## Testing and Validation

### Phase 1 Validation
- [ ] Verify no tokens in logs
- [ ] Test authentication cannot be bypassed
- [ ] Confirm Prisma works in production
- [ ] Test input validation blocks malicious input
- [ ] Verify no hardcoded credentials
- [ ] Confirm containers run as non-root

### Phase 2 Validation
- [ ] Test token refresh flow
- [ ] Verify rate limiting works
- [ ] Test all input validation schemas
- [ ] Confirm security headers present
- [ ] Test SQL injection prevention
- [ ] Verify data encryption works

### Phase 3 Validation
- [ ] Test GDPR compliance features
- [ ] Verify audit logging captures events
- [ ] Test security monitoring alerts

## Dependencies and Requirements

### New Dependencies Needed
```json
{
  "isomorphic-dompurify": "^2.0.0",
  "zod": "^3.22.0",
  "@upstash/ratelimit": "^2.0.0",
  "@upstash/redis": "^1.28.0",
  "bcrypt": "^5.1.0",
  "crypto": "built-in"
}
```

### Environment Variables Required
```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
JWT_SECRET=...
STRIPE_SECRET_KEY=...
SENDGRID_API_KEY=...
ENCRYPTION_KEY=...
ALLOWED_ORIGINS=https://yourdomain.com,https://staging.yourdomain.com
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
API_KEY_SECRET=...
```

## Team Assignments

- **Backend Developer**: Fixes 1-3, 7-8, 11-12, 14
- **Frontend Developer**: Fixes 4-5, 9-10
- **DevOps Engineer**: Fixes 6, 15
- **Legal/Compliance**: Fix 13

## Success Criteria

### Phase 1 Complete When:
- No critical vulnerabilities remain
- All authentication bypasses fixed
- No credentials in codebase
- Basic input validation implemented

### Phase 2 Complete When:
- Comprehensive security headers active
- Rate limiting implemented
- All APIs properly validated
- Data encryption in place

### Phase 3 Complete When:
- GDPR compliance achieved
- Security monitoring operational
- Audit logging capturing all events
- Regular security assessments scheduled

## Emergency Contacts

In case of security incident during remediation:
- Technical Lead: [Contact Info]
- Security Team: [Contact Info]
- Legal Team: [Contact Info]

---

**⚠️ CRITICAL WARNING**: Do not deploy to production until Phase 1 is 100% complete and validated. The current security posture poses significant risk to user data and company liability.

**Last Updated**: February 17, 2026
**Next Review**: Upon Phase 1 completion
// Lightweight JWT validation for Edge Runtime (middleware)
// This module cannot import Prisma or other Node.js APIs
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
}

function getMagicLinkSecret(): string {
  const secret = process?.env?.MAGIC_LINK_SECRET;
  if (!secret) {
    throw new Error('MAGIC_LINK_SECRET environment variable is not set');
  }
  return secret;
}

export async function validateTokenForMiddleware(
  token: string,
): Promise<TokenPayload | null> {
  try {
    const secret = getMagicLinkSecret();
    const payload = jwt.verify(token, secret) as TokenPayload;
    
    // Basic validation - just check if token is structurally valid
    if (!payload.userId || !payload.email) {
      return null;
    }
    
    // Note: Cannot validate against database in Edge Runtime
    // Full validation must happen in API routes using Node.js runtime
    return payload;
  } catch (error) {
    // Don't log detailed errors in middleware for security
    return null;
  }
}
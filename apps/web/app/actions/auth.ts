'use server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { validateTokenWithUser, getUserIdFromToken } from '@/lib/auth';

/**
 * Validate session from cookie only (no prompt context)
 * Use this for general authenticated pages
 * Now uses direct Prisma access instead of calling NestJS API
 */
export async function requireAuth(): Promise<{ valid: boolean; userId?: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token) {
    redirect('/');
  }
  
  // Direct validation with Prisma - no API call
  const result = await validateTokenWithUser(token);
  
  if (!result.valid || !result.userId) {
    redirect('/');
  }
  
  return {
    valid: true,
    userId: result.userId,
  };
}

/**
 * Get current user ID from session
 * Returns null if not authenticated
 * Now uses direct token validation instead of calling NestJS API
 */
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return null;
    }
    
    return getUserIdFromToken(token);
  } catch {
    return null;
  }
}

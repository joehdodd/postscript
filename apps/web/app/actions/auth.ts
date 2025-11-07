'use server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { validateTokenWithUser, getUserIdFromToken } from '@/lib/auth';

export async function requireAuth(): Promise<{
  valid: boolean;
  userId?: string;
  promptId?: string;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/');
  }

  const result = await validateTokenWithUser(token);
  if (!result.valid || !result.userId) {
    redirect('/');
  }
  return {
    valid: true,
    userId: result.userId,
    ...(result.promptId && { promptId: result.promptId }),
  };
}

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

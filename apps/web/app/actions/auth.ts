'use server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

/**
 * Extracts the token from searchParams (or cookies, if you want to extend),
 * authenticates it, and redirects if invalid. Returns the auth result.
 */
export async function requireAuth(
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>,
) {
  const params = await searchParams;
  const search = new URLSearchParams(
    Array.isArray(params.token)
      ? params.token.map((t) => ['token', t])
      : [['token', params.token || '']],
  );
  const cookieStore = await cookies();
  let token = cookieStore.get('token')?.value;
  if (!token) {
    const urlToken = search.get('token') || undefined;
    token = urlToken;
  }
  if (!token) {
    redirect('/');
  }
  const authResult = await auth(token);
  return authResult;
}

// getTokenFromCookieOrSearchParams is no longer needed, logic moved to requireAuth

export async function auth(token: string | string[]) {
  const res = await fetch(
    `${process.env.NEST_API_URL}/auth?token=${Array.isArray(token) ? token.join(',') : token}`,
    {
      cache: 'no-store',
    },
  );
  if (!res.ok) {
    return { valid: false };
  }
  return res.json() as Promise<{
    valid: boolean;
    userId?: string;
    promptId?: string;
  }>;
}

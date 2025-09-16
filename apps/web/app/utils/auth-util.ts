import { redirect } from 'next/navigation';
import { auth } from '../actions/auth';
import { cookies } from 'next/headers';

/**
 * Extracts the token from searchParams (or cookies, if you want to extend),
 * authenticates it, and redirects if invalid. Returns the auth result.
 */
export async function requireAuth(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  const tokenParam = (await searchParams).token;
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam || '';
  if (!token) {
    redirect('/');
  }
  const authResult = await auth(token);
  return authResult;
}

export async function getTokenFromCookieOrSearchParams(
  searchParams: URLSearchParams,
) {
  const cookieStore = cookies();
  const cookieToken = (await cookieStore).get('token')?.value;
  if (cookieToken) return cookieToken;

  // Fallback: get token from search params
  const urlToken = searchParams.get('token');
  return urlToken;
}

import { cookies } from 'next/headers';

export async function getTokenFromCookieOrSearchParams(searchParams: URLSearchParams) {
  const cookieStore = cookies();
  const cookieToken = (await cookieStore).get('token')?.value;
  if (cookieToken) return cookieToken;

  // Fallback: get token from search params
  const urlToken = searchParams.get('token');
  return urlToken;
}

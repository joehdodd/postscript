'use server';

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
  return res.json() as Promise<{ valid: boolean; userId?: string; promptId?: string }>;
}
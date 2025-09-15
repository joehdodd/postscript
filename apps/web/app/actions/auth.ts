'use server';

export async function auth(token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth?token=${token}`,
    {
      cache: 'no-store',
    },
  );
  if (!res.ok) {
    throw new Error('Failed to authenticate');
  }
  return res.json() as Promise<{ valid: boolean; userId?: string; promptId?: string }>;
}
'use server';

export async function fetchUserPrompts(userId: string) {
  const res = await fetch(`http://localhost:3000/prompts/user/${userId}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch prompt');
  }
  return res.json();
}

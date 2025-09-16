'use server'

export async function fetchPrompt(promptId: string) {
  const res = await fetch(`http://localhost:3000/prompts/${promptId}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch prompt');
  }
  return res.json();
}
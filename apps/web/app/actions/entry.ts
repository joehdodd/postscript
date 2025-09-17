'use server';

export async function createEntry(
  data: FormData,
  userId: string,
  promptId: string,
) {
  const jsonData = Object.fromEntries(data.entries());
  const res = await fetch('http://localhost:3000/entries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...jsonData,
      userId,
      promptId,
    }),
  });
  if (!res.ok) {
    throw new Error('Failed to create entry');
  }
}

export async function fetchEntryByPromptAndUser(
  promptId: string,
  userId: string,
) {
  const res = await fetch(
    `http://localhost:3000/entries/prompt/${promptId}/user/${userId}`,
    {
      cache: 'no-store',
    },
  );
  if (!res.ok) {
    throw new Error('Failed to fetch entry');
  }
  return res.json() as Promise<{
    id: string;
    content: string;
    userId: string;
    promptId: string;
  } | null>;
}

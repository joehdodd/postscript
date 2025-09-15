'use server';

export async function createEntry(data: FormData) {
  const jsonData = Object.fromEntries(data.entries());
  const res = await fetch('http://localhost:3000/entries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...jsonData,
      userId: '5736023a-a36c-48e7-98ef-2151076818fd',
      promptId: '48c232e8-5b69-4c67-a20a-a19439180f39',
    }),
  });
  if (!res.ok) {
    throw new Error('Failed to create entry');
  }
}

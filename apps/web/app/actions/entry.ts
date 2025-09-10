'use server';

export async function createEntry(data: FormData) {
  const jsonData = Object.fromEntries(data.entries());
  const res = await fetch('http://localhost:3000/entries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jsonData),
  });
  if (!res.ok) {
    throw new Error('Failed to create entry');
  }
}

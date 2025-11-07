/**
 * Script to generate a test magic link token
 * Usage: npx tsx scripts/generate-test-token.ts <email> [promptId]
 */

import jwt from 'jsonwebtoken';

const MAGIC_LINK_SECRET = process.env.MAGIC_LINK_SECRET || 'supersecret';

const email = process.argv[2];
const promptId = process.argv[3];

if (!email) {
  console.error('Usage: npx tsx scripts/generate-test-token.ts <email> [promptId]');
  process.exit(1);
}

const payload: { email: string; purpose: string; promptId?: string } = {
  email,
  purpose: 'auth',
};

if (promptId) {
  payload.promptId = promptId;
  payload.purpose = 'entry';
}

const token = jwt.sign(payload, MAGIC_LINK_SECRET, { expiresIn: '7d' });

console.log('\n=== Test Magic Link Token ===');
console.log(`Email: ${email}`);
if (promptId) console.log(`Prompt ID: ${promptId}`);
console.log(`\nToken: ${token}`);
console.log(`\nTest URL: http://localhost:3001/entry?token=${token}`);
console.log('================================\n');

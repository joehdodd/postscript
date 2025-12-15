#!/usr/bin/env node

// Database health check script
// Run this before starting the Next.js development server

import { ensureDatabaseConnection } from '../lib/db-health';

async function startupHealthCheck() {
  console.log('🔍 Checking database connection...');
  
  try {
    await ensureDatabaseConnection();
    console.log('✅ Database connection verified. Starting application...');
    process.exit(0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: { message: string } | any) {
    console.error('❌ Database health check failed:', error.message);
    console.error('\n💡 To fix this issue:');
    console.error('  1. Check if your Supabase database is paused');
    console.error('  2. Verify your DATABASE_URL in .env');
    console.error('  3. Ensure your database is accessible\n');
    process.exit(1);
  }
}

startupHealthCheck();
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
    console.log('\n' + '='.repeat(80));
    console.error('🚨 APPLICATION STARTUP FAILED');
    console.log('='.repeat(80));
    console.error('\n' + error.message + '\n');
    console.log('='.repeat(80));
    console.log('Need help? Check the Supabase dashboard: https://supabase.com/dashboard');
    console.log('='.repeat(80) + '\n');
    process.exit(1);
  }
}

startupHealthCheck();
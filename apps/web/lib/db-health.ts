import { prisma } from '@repo/prisma';

let dbHealthChecked = false;
let dbHealthy = false;

/**
 * Centralized database health check
 * Tests connection once and caches the result
 */
export async function ensureDatabaseConnection(): Promise<void> {
  // Only check once per application lifecycle
  if (dbHealthChecked) {
    if (!dbHealthy) {
      throw new Error('Database connection failed. Application cannot start.');
    }
    return;
  }

  console.log('Checking database connection...');

  try {
    // Simple query to test connection
    await prisma.$queryRaw`SELECT 1 as test`;
    
    dbHealthy = true;
    dbHealthChecked = true;
    console.log('✅ Database connection successful');
  } catch (error) {
    dbHealthChecked = true;
    dbHealthy = false;
    
    // Get error details
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorCode = (error as any)?.code;
    
    console.error('❌ Database connection failed');
    console.error('   Raw error:', errorMessage);
    if (errorCode) console.error('   Error code:', errorCode);
    
    // Detect specific error conditions and provide targeted guidance
    let specificError = 'Database connection failed';
    let solution = '';
    
    if (errorMessage.includes('Tenant or user not found')) {
      specificError = '🚫 SUPABASE DATABASE PAUSED';
      solution = `Your Supabase database appears to be paused (free tier auto-pauses after 7 days of inactivity).

🔧 SOLUTION:
   1. Go to https://supabase.com/dashboard
   2. Find your project
   3. Click "Resume" or "Unpause" button
   4. Wait 2-3 minutes for database to start
   5. Restart your development server

⏱️  Note: Free tier databases pause automatically after 7 days of inactivity.`;
    } else if (errorMessage.includes('Connection refused') || errorMessage.includes('ECONNREFUSED')) {
      specificError = '🔌 DATABASE SERVER UNREACHABLE';
      solution = `Cannot connect to the database server.

🔧 SOLUTIONS:
   1. If using Supabase: Check if project is paused in dashboard
   2. If using local database: Ensure PostgreSQL is running
   3. Check your DATABASE_URL in .env file
   4. Verify network connectivity`;
    } else if (errorMessage.includes('password authentication failed') || errorMessage.includes('P1001')) {
      specificError = '🔐 AUTHENTICATION FAILED';
      solution = `Database credentials are incorrect.

🔧 SOLUTIONS:
   1. Check DATABASE_URL in .env file
   2. Verify username and password are correct
   3. If using Supabase: Get fresh connection string from dashboard
   4. Ensure connection string format is correct`;
    } else if (errorMessage.includes('database') && errorMessage.includes('does not exist')) {
      specificError = '📁 DATABASE NOT FOUND';
      solution = `The specified database does not exist.

🔧 SOLUTIONS:
   1. Check database name in DATABASE_URL
   2. Run database migrations: npm run db:push
   3. If using Supabase: verify project is set up correctly`;
    } else {
      specificError = '❌ UNKNOWN DATABASE ERROR';
      solution = `An unexpected database error occurred.

🔧 GENERAL SOLUTIONS:
   1. Check if Supabase project is paused
   2. Verify DATABASE_URL in .env
   3. Test database connection manually
   4. Check Supabase dashboard for status updates

Error details: ${errorMessage}`;
    }
    
    throw new Error(`${specificError}\n\n${solution}`);
  }
}

/**
 * Check if database connection has been verified
 */
export function isDatabaseHealthy(): boolean {
  return dbHealthChecked && dbHealthy;
}

/**
 * Reset health check state (useful for testing)
 */
export function resetDatabaseHealth(): void {
  dbHealthChecked = false;
  dbHealthy = false;
}
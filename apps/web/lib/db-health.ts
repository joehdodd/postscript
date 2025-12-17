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
    
    console.error('❌ Database connection failed:', error);
    
    // Check for specific Supabase/Postgres paused database errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage.includes('database is paused') || 
        errorMessage.includes('connection refused') ||
        errorMessage.includes('P1001')) {
      throw new Error(
        'Database is paused or unavailable. Please unpause your Supabase database and restart the application.'
      );
    }
    
    throw new Error(
      `Database connection failed: ${errorMessage}. Please check your database configuration.`
    );
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
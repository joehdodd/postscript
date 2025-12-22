'use server';
import { prisma } from '@repo/prisma';
import { requireAuth } from './auth';

interface DashboardMetrics {
  totalEntries: number;
  writingStreak: number;
  responseRate: number;
  recentActivity: number;
}

interface EntryPreview {
  id: string;
  content: string;
  createdAt: Date;
  promptId: string;
  prompt: {
    content: string;
  };
}

interface DashboardData {
  metrics: DashboardMetrics;
  recentEntries: EntryPreview[];
  isEmpty: boolean;
}

/**
 * Calculate writing streak based on user frequency and entry dates
 */
async function calculateWritingStreak(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { frequency: true }
  });

  const entries = await prisma.entry.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: { createdAt: true }
  });

  if (!entries.length || !user) return 0;

  const intervalDays = user.frequency === 'daily' ? 1 : 7;
  let streak = 0;
  let currentDate = new Date();
  
  for (const entry of entries) {
    const daysDiff = Math.floor(
      (currentDate.getTime() - entry.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysDiff <= intervalDays * (streak + 1)) {
      streak++;
      currentDate = entry.createdAt;
    } else {
      break;
    }
  }
  
  return streak;
}

/**
 * Calculate response rate over last 30 days
 */
async function calculateResponseRate(userId: string): Promise<number> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  const [totalPrompts, totalEntries] = await Promise.all([
    prisma.prompt.count({
      where: { 
        userId, 
        createdAt: { gte: thirtyDaysAgo } 
      }
    }),
    prisma.entry.count({
      where: { 
        userId, 
        createdAt: { gte: thirtyDaysAgo } 
      }
    })
  ]);
  
  return totalPrompts > 0 ? Math.round((totalEntries / totalPrompts) * 100) : 0;
}

/**
 * Fetch all dashboard data for authenticated user
 */
export async function fetchDashboardData(): Promise<DashboardData> {
  const authResult = await requireAuth();
  
  // requireAuth redirects if invalid, so if we reach here, userId exists
  const userId = authResult.userId!;
  
  const [
    totalEntries,
    recentEntries,
    writingStreak,
    responseRate,
    recentActivity
  ] = await Promise.all([
    // Total entries count
    prisma.entry.count({ where: { userId } }),
    
    // Last 5 entries with prompt context
    prisma.entry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        prompt: {
          select: { content: true }
        }
      }
    }),
    
    // Writing streak calculation
    calculateWritingStreak(userId),
    
    // Response rate over 30 days
    calculateResponseRate(userId),
    
    // Recent activity (entries in last 30 days)
    prisma.entry.count({
      where: { 
        userId,
        createdAt: { 
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) 
        }
      }
    })
  ]);
  
  return {
    metrics: {
      totalEntries,
      writingStreak,
      responseRate,
      recentActivity
    },
    recentEntries,
    isEmpty: totalEntries === 0
  };
}

/**
 * Create entry snippet for previews
 */
export async function createEntrySnippet(content: string, maxLength: number = 150): Promise<string> {
  if (content.length <= maxLength) return content;
  
  const truncated = content.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 
    ? truncated.substring(0, lastSpace) + '...' 
    : truncated + '...';
}
import { MetricCard } from './MetricCard';

interface DashboardMetricsProps {
  totalEntries: number;
  writingStreak: number;
  responseRate: number;
  recentActivity: number;
  loading?: boolean;
}

export function DashboardMetrics({ 
  totalEntries, 
  writingStreak, 
  responseRate, 
  recentActivity,
  loading = false 
}: DashboardMetricsProps) {
  const isGoodStreak = writingStreak >= 3;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard 
        title="Total Entries"
        value={totalEntries}
        loading={loading}
      />
      <MetricCard 
        title="Writing Streak"
        value={loading ? 0 : `${writingStreak} days`}
        isHighlight={!loading && isGoodStreak}
        loading={loading}
      />
      <MetricCard 
        title="Response Rate"
        value={loading ? 0 : `${responseRate}%`}
        loading={loading}
      />
      <MetricCard 
        title="Recent Activity"
        value={loading ? 0 : `${recentActivity} entries`}
        loading={loading}
      />
    </div>
  );
}
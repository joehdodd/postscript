import { DashboardMetrics } from './Dashboard/DashboardMetrics';
import { RecentEntries } from './Dashboard/RecentEntries';
import { EmptyDashboard } from './Dashboard/EmptyDashboard';
import { fetchDashboardData } from '../actions/dashboard';

export async function Dashboard() {
  let dashboardData;
  
  try {
    dashboardData = await fetchDashboardData();
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    // Fallback to empty state if data fetch fails
    dashboardData = {
      metrics: { totalEntries: 0, writingStreak: 0, responseRate: 0, recentActivity: 0 },
      recentEntries: [],
      isEmpty: true
    };
  }

  // Show empty state for new users
  if (dashboardData.isEmpty) {
    return <EmptyDashboard />;
  }

  // Show populated dashboard
  return (
    <div className="min-h-screen bg-ps-primary-50">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ps-primary mb-2">Dashboard</h1>
            <p className="text-ps-secondary">Your writing journey at a glance</p>
          </div>

          <div className="space-y-8">
            <DashboardMetrics 
              totalEntries={dashboardData.metrics.totalEntries}
              writingStreak={dashboardData.metrics.writingStreak}
              responseRate={dashboardData.metrics.responseRate}
              recentActivity={dashboardData.metrics.recentActivity}
            />

            <RecentEntries entries={dashboardData.recentEntries} />
          </div>
        </div>
      </div>
    </div>
  );
}
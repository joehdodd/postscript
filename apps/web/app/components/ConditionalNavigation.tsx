import { getCurrentUserId } from '../actions/auth';
import { fetchUserSubscription } from '../actions/account';
import Navigation from './Navigation';
import PublicNavigation from './PublicNavigation';

export default async function ConditionalNavigation() {
  const userId = await getCurrentUserId();
  const isAuthenticated = !!userId;
  let hasDashboardAccess = false;
  const subscription = isAuthenticated ? await fetchUserSubscription() : null;
  hasDashboardAccess = subscription?.planType === 'PLATINUM';

  if (isAuthenticated) {
    return <Navigation hasDashboardAccess={hasDashboardAccess} />;
  } else {
    return <PublicNavigation />;
  }
}

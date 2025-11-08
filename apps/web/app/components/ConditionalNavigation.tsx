import { getCurrentUserId } from '../actions/auth';
import Navigation from './Navigation';
import PublicNavigation from './PublicNavigation';

export default async function ConditionalNavigation() {
  const userId = await getCurrentUserId();
  const isAuthenticated = !!userId;

  if (isAuthenticated) {
    return <Navigation />;
  } else {
    return <PublicNavigation />;
  }
}
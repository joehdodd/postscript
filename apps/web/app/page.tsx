import { redirect } from 'next/navigation';
import { fetchUserSubscription } from './actions/account';
import { Dashboard } from './components/Dashboard';
import { Marketing } from './components/Marketing';
import { cookies } from 'next/headers';
import { validateTokenWithUser } from '@/lib/auth';

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const showSignup = params.signup === 'true';

  // Check if user is authenticated
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  let isAuthenticated = false;
  let hasDashboardAccess = false;

  if (token) {
    const result = await validateTokenWithUser(token);
    isAuthenticated = result.valid && !!result.userId;

    if (isAuthenticated) {
      const subscription = await fetchUserSubscription();
      hasDashboardAccess = subscription?.planType === 'PLATINUM';
    }
  }

  // Return appropriate component or redirect based on authentication and subscription tier
  if (isAuthenticated && hasDashboardAccess) {
    return <Dashboard />;
  } else if (isAuthenticated) {
    redirect('/prompt'); // Replace with the actual path to completed prompts
    return null; // Ensures no component renders
  }

  return <Marketing showSignup={showSignup} />;
}

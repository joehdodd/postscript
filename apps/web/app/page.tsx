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

  if (token) {
    const result = await validateTokenWithUser(token);
    isAuthenticated = result.valid && !!result.userId;
  }

  // Return appropriate component based on authentication state
  if (isAuthenticated) {
    return <Dashboard />;
  }
  
  return <Marketing showSignup={showSignup} />;
}

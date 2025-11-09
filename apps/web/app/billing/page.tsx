import { requireAuth } from '../actions/auth';
import { redirect } from 'next/navigation';
import PricingCards from '../components/PricingCards';

export default async function BillingPage() {
  const { userId } = await requireAuth();
  if (!userId) {
    redirect('/');
  }

  return <PricingCards isAuthenticated={true} />;
}
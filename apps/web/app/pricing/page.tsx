import { fetchUserSubscription } from '../actions/account';
import { getCurrentUserId } from '../actions/auth';
import PricingCards from '../components/PricingCards';

export default async function PricingPage() {
  const currentUser = await getCurrentUserId();

  let currentPriceId: string | undefined;

  if (currentUser) {
    try {
      const subscription = await fetchUserSubscription();
      currentPriceId = subscription?.priceId;
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  }
  return (
    <div className="min-h-screen bg-ps-primary">
      <PricingCards
        isAuthenticated={!!currentUser}
        currentPriceId={currentPriceId || ''}
      />
    </div>
  );
}

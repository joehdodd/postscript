import { requireAuth } from '../actions/auth';
import { fetchUserSubscription } from '../actions/account';
import PricingCards from '../components/PricingCards';

export default async function PricingPage() {
  const { userId } = await requireAuth();
  
  let currentPriceId: string | undefined;
  
  if (userId) {
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
        isAuthenticated={userId ? true : false} 
        currentPriceId={currentPriceId}
      />
    </div>
  );
}

import { requireAuth } from '../actions/auth';
import PricingCards from '../components/PricingCards';

export default async function PricingPage() {
  const { userId } = await requireAuth();
  return (
    <div className="min-h-screen bg-ps-primary">
      <PricingCards isAuthenticated={userId ? true : false} />
    </div>
  );
}

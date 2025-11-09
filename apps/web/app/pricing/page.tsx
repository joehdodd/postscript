import PricingCards from '../components/PricingCards';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-ps-primary">
      <PricingCards isAuthenticated={false} />
    </div>
  );
}

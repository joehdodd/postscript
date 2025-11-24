'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type PricingPlan = {
  id: string;
  name: string;
  price: string;
  priceId: string;
  features: string[];
};

type PricingCardsProps = {
  isAuthenticated?: boolean;
  currentPriceId?: string; // Stripe price ID of current subscription
};

const pricingPlans: PricingPlan[] = [
  {
    id: 'gold',
    name: 'Gold',
    price: '$2.50',
    priceId: process.env.NODE_ENV === 'production' ? 'price_1SS2MWIwBSBptkFZZv87WG0B' : 'price_1SX6h8En4euahWDN0T51nrjM',
    features: [
      'Unlimited prompts',
    ],
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: '$5.00',
    priceId: process.env.NODE_ENV === 'production' ? 'price_1SSJBtIwBSBptkFZ8eZ2kNKk' : 'price_1SX6gsEn4euahWDNNCthbwzZ',
    features: [
      'Unlimited prompts',
      'Analytics dashboard',
      'Export entries',
    ],
  },
];

export default function PricingCards({
  isAuthenticated = false,
  currentPriceId,
}: PricingCardsProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const router = useRouter();

  const isCurrentPlan = (plan: PricingPlan) => {
    // Check if the user's current subscription price ID matches this plan's price ID
    return currentPriceId === plan.priceId;
  };

  const handleSubscribe = async (priceId: string, planId: string) => {
    if (!priceId) return;

    if (!isAuthenticated) {
      router.push('/?signup=true');
      return;
    }

    setIsLoading(planId);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const { url } = await response.json();

      if (url) {
        router.push(url);
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="bg-ps-primary min-h-screen py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-ps-primary mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-ps-text-secondary">
              Upgrade your journaling experience with premium features
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className="flex flex-col justify-between bg-ps-secondary rounded-lg p-8 shadow-md"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-ps-primary mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-4xl font-bold text-ps-primary mb-4">
                    {plan.price}
                    {plan.price !== '$0' && (
                      <span className="text-lg">/month</span>
                    )}
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-ps-text-primary"
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        style={{ color: 'var(--ps-secondary-600)' }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                {isCurrentPlan(plan) ? (
                  <div className="w-full py-3 rounded-lg font-medium text-center bg-ps-neutral-200 text-ps-text-secondary">
                    Current Plan
                  </div>
                ) : (
                  <button
                    onClick={() => handleSubscribe(plan.priceId, plan.id)}
                    disabled={isLoading === plan.id}
                    className="w-full py-3 rounded-lg font-medium transition-all duration-200 bg-ps-primary hover:bg-ps-primary-700 hover:shadow-lg disabled:opacity-50"
                  >
                    {isLoading === plan.id ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : isAuthenticated ? (
                      'Upgrade Now'
                    ) : (
                      'Get Started'
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

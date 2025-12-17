'use client';

import FreePlanCard from './FreePlanCard';
import SubscriptionActions from './SubscriptionActions';
import { Subscription } from '../../../types/subscription';

type SubscriptionStatusProps = {
  subscription?: Subscription;
  onUpdate?: () => void;
};

export default function SubscriptionStatus({
  subscription,
  onUpdate,
}: SubscriptionStatusProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const getStatusColor = (status: string) => {
    console.log('Subscription status:', status);
    switch (status) {
      case 'active':
        return 'bg-ps-secondary-500 text-green-600';
      case 'canceled':
        return 'bg-ps-neutral-400 text-orange-600';
      case 'past_due':
        return 'bg-ps-accent-500 text-red-600';
      default:
        return 'bg-ps-neutral-400 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'canceled':
        return 'Canceled';
      case 'past_due':
        return 'Past Due';
      case 'incomplete':
        return 'Incomplete';
      default:
        return 'Unknown';
    }
  };

  const getPlanDisplayName = (planType: string) => {
    switch (planType.toLowerCase()) {
      case 'gold':
        return 'Gold Plan';
      case 'platinum':
        return 'Platinum Plan';
      default:
        return 'Subscription';
    }
  };

  const getPlanPrice = (planType: string) => {
    switch (planType.toLowerCase()) {
      case 'gold':
        return '$19';
      case 'platinum':
        return '$5';
      default:
        return '$0';
    }
  };

  if (!subscription) {
    return <FreePlanCard />;
  }

  return (
    <div className="bg-ps-secondary rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-ps-primary mb-4">
        Current Plan
      </h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-ps-primary">
              {getPlanDisplayName(subscription.planType)}
            </h3>
            <p className="text-ps-text-secondary">
              {getPlanPrice(subscription.planType)}/month
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}
          >
            {getStatusText(subscription.status)}
          </span>
        </div>
        <div className="pt-4 border-t border-ps-border">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-ps-text-secondary">Next billing date:</span>
              <span className="text-ps-text-primary font-medium">
                {formatDate(subscription.currentPeriodEnd)}
              </span>
            </div>

            {subscription.cancelAtPeriodEnd && (
              <div className="p-3 bg-ps-accent-50 rounded-lg">
                <p className="text-sm text-ps-accent-700">
                  Your subscription will not renew after{' '}
                  {formatDate(subscription.currentPeriodEnd)}.
                </p>
              </div>
            )}
          </div>
        </div>
        <SubscriptionActions
          subscription={subscription}
          onUpdate={onUpdate || (() => {})}
        />
      </div>
    </div>
  );
}

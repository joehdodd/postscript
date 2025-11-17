import Link from 'next/link';

type Subscription = {
  id: string;
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  planName: string;
  planPrice: string;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
};

type SubscriptionStatusProps = {
  userId: string;
  subscription?: Subscription;
};

export default function SubscriptionStatus({ subscription }: SubscriptionStatusProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-ps-secondary-500 text-white';
      case 'canceled':
        return 'bg-ps-neutral-400 text-white';
      case 'past_due':
        return 'bg-ps-accent-500 text-white';
      default:
        return 'bg-ps-neutral-400 text-white';
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

  if (!subscription) {
    // Free plan or no subscription
    return (
      <div className="bg-ps-secondary rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-ps-primary mb-4">
          Current Plan
        </h2>
        
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-ps-neutral-200 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-ps-text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-ps-primary mb-2">
            Free Plan
          </h3>
          <p className="text-ps-text-secondary mb-6">
            You&apos;re currently on the free plan with basic features.
          </p>
          <Link
            href="/pricing"
            className="inline-block px-6 py-3 bg-ps-primary-600 text-white rounded-lg font-medium hover:bg-ps-primary-700 transition-colors duration-200"
          >
            Upgrade to Premium
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ps-secondary rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-ps-primary mb-4">
        Current Plan
      </h2>
      
      <div className="space-y-4">
        {/* Plan Info */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-ps-primary">
              {subscription.planName}
            </h3>
            <p className="text-ps-text-secondary">
              {subscription.planPrice}/month
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}
          >
            {getStatusText(subscription.status)}
          </span>
        </div>

        {/* Billing Info */}
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
                  Your subscription will not renew after {formatDate(subscription.currentPeriodEnd)}.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 space-y-3">
          {subscription.status === 'active' && !subscription.cancelAtPeriodEnd && (
            <button className="w-full px-4 py-2 text-sm font-medium text-ps-accent-600 hover:text-ps-accent-700 transition-colors duration-200">
              Cancel Subscription
            </button>
          )}
          
          {subscription.cancelAtPeriodEnd && (
            <button className="w-full px-4 py-2 text-sm font-medium bg-ps-primary-600 text-white rounded-md hover:bg-ps-primary-700 transition-colors duration-200">
              Reactivate Subscription
            </button>
          )}

          <Link
            href="/pricing"
            className="block w-full px-4 py-2 text-sm font-medium text-center text-ps-primary-600 hover:text-ps-primary-700 transition-colors duration-200"
          >
            Change Plan
          </Link>
        </div>
      </div>
    </div>
  );
}
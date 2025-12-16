import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireAuth } from '../../actions/auth';
import { processBillingSuccess } from '../../services/billing';

type BillingSuccessProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function BillingSuccess({ searchParams }: BillingSuccessProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  // Redirect if no session ID provided
  if (!sessionId) {
    redirect('/pricing');
  }

  // Get current user
  const { userId } = await requireAuth();
  if (!userId) {
    redirect('/login');
  }

  // Process the billing success using the service
  const result = await processBillingSuccess(sessionId, userId);

  // Handle errors or failed payments
  if (!result.success) {
    if (result.error === 'Payment was not successful') {
      redirect('/billing/cancel');
    } else {
      redirect('/pricing');
    }
  }

  const { planName, amount } = result;

  return (
    <div className="min-h-screen bg-ps-primary flex items-center justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-ps-secondary rounded-lg p-8 text-center border shadow-md">
          <div className="w-8 h-8 mx-auto mb-2 bg-ps-secondary-500 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-ps-primary mb-4">
            Payment Successful!
          </h1>
          <p className="text-ps-text-secondary mb-2">
            Thank you for subscribing to <strong>{planName}</strong>!
          </p>   
          {amount && (
            <p className="text-ps-text-secondary mb-4">
              Your subscription of <strong>{amount}/month</strong> is now active.
            </p>
          )}
          <p className="text-ps-text-secondary mb-6">
            You now have access to all premium features and can start enjoying your enhanced journaling experience.
          </p>
          <div className="space-y-3">
            <Link
              href="/prompt"
              className="block w-full px-6 py-3 bg-ps-primary-500 text-green-500 rounded-lg font-medium hover:bg-ps-primary-600 transition-colors duration-200"
            >
              Start Writing →
            </Link>
            <Link
              href="/account"
              className="block w-full px-6 py-2 text-ps-text-secondary hover:text-ps-primary transition-colors duration-200"
            >
              Manage Subscription
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
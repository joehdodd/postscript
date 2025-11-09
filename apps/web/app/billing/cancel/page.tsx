import Link from 'next/link';

export default function BillingCancel() {
  return (
    <div className="min-h-screen bg-ps-primary flex items-center justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-ps-secondary rounded-lg p-8 text-center border shadow-md">
          <div className="w-16 h-16 mx-auto mb-6 bg-ps-neutral-400 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-ps-primary mb-4">
            Payment Cancelled
          </h1>
          
          <p className="text-ps-text-secondary mb-6">
            No worries! You can upgrade to Premium at any time to unlock 
            advanced features and enhance your journaling experience.
          </p>
          
          <div className="space-y-3">
            <Link
              href="/billing"
              className="block w-full px-6 py-3 bg-ps-primary-500 text-white rounded-lg font-medium hover:bg-ps-primary-600 transition-colors duration-200"
            >
              Try Again
            </Link>
            <Link
              href="/prompt"
              className="block w-full px-6 py-3 border border-ps-primary-500 text-ps-primary-500 rounded-lg font-medium hover:bg-ps-primary-50 transition-colors duration-200"
            >
              Continue with Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
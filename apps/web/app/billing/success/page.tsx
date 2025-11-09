import Link from 'next/link';

export default function BillingSuccess() {
  return (
    <div className="min-h-screen bg-ps-primary flex items-center justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-ps-secondary rounded-lg p-8 text-center border shadow-md">
          <div className="w-16 h-16 mx-auto mb-6 bg-ps-secondary-500 rounded-full flex items-center justify-center">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-ps-primary mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-ps-text-secondary mb-6">
            Thank you for upgrading to Premium. Your subscription is now active 
            and you have access to all premium features.
          </p>
          
          <Link
            href="/prompt"
            className="inline-block px-6 py-3 bg-ps-primary-500 text-white rounded-lg font-medium hover:bg-ps-primary-600 transition-colors duration-200"
          >
            Start Writing →
          </Link>
        </div>
      </div>
    </div>
  );
}
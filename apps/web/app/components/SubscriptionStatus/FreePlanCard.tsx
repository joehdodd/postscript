'use client';

import Link from 'next/link';

export default function FreePlanCard() {
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
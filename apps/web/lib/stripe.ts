import { loadStripe, Stripe } from '@stripe/stripe-js';
import StripeServer from 'stripe';

// Environment variable validation following our guidelines pattern
function getStripePublishableKey(): string {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable is not set');
  }
  return key;
}

function getStripeSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set');
  }
  return key;
}

// Singleton pattern for Stripe instance
let stripePromise: Promise<Stripe | null>;

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(getStripePublishableKey());
  }
  return stripePromise;
};

// Server-side Stripe instance (for API routes)
export const stripe = new StripeServer(getStripeSecretKey(), {
  apiVersion: '2025-10-29.clover',
});

// Export helper function for environment variable
export { getStripeSecretKey };
'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Load Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface AddPaymentMethodFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

function PaymentMethodForm({ onSuccess, onCancel }: AddPaymentMethodFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    // Create setup intent when component mounts
    const createSetupIntent = async () => {
      try {
        const response = await fetch('/api/stripe/setup-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) {
          throw new Error('Failed to create setup intent');
        }
        
        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);
      } catch (err) {
        setError('Failed to initialize payment form');
        console.error(err);
      }
    };

    createSetupIntent();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    
    if (!cardElement) {
      setError('Card element not found');
      setIsLoading(false);
      return;
    }

    try {
      const { error: confirmError, setupIntent } = await stripe.confirmCardSetup(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (confirmError) {
        setError(confirmError.message || 'Failed to add payment method');
      } else if (setupIntent && setupIntent.status === 'succeeded') {
        onSuccess?.();
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-ps-border">
      <h3 className="text-lg font-semibold text-ps-primary mb-4">
        Add Payment Method
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ps-text-primary mb-2">
            Card Information
          </label>
          <div className="p-3 border border-ps-border rounded-md">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={!stripe || isLoading || !clientSecret}
            className="flex-1 bg-ps-primary-600 text-white py-2 px-4 rounded-md hover:bg-ps-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Adding...' : 'Add Payment Method'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AddPaymentMethodForm(props: AddPaymentMethodFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentMethodForm {...props} />
    </Elements>
  );
}
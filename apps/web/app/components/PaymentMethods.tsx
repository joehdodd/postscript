'use client';

import { useState } from 'react';
import AddPaymentMethodForm from './AddPaymentMethodForm';

type PaymentMethod = {
  id: string;
  type: 'card';
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  isDefault: boolean;
};

type PaymentMethodsProps = {
  userId: string;
  paymentMethods?: PaymentMethod[];
  onRefresh?: () => void;
};

export default function PaymentMethods({ 
  paymentMethods = [], 
  onRefresh 
}: PaymentMethodsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddPaymentMethod = () => {
    setShowAddForm(true);
  };

  const handleAddSuccess = () => {
    setShowAddForm(false);
    onRefresh?.(); // Refresh the payment methods list
  };

  const handleAddCancel = () => {
    setShowAddForm(false);
  };

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    if (!confirm('Are you sure you want to delete this payment method?')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/stripe/payment-methods/${paymentMethodId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onRefresh?.(); // Refresh payment methods list
      } else {
        const error = await response.json();
        console.error('Delete failed:', error.error);
      }
    } catch (error) {
      console.error('Error deleting payment method:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (paymentMethodId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/stripe/payment-methods/${paymentMethodId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'set_default' }),
      });

      if (response.ok) {
        onRefresh?.(); // Refresh payment methods list
      } else {
        const error = await response.json();
        console.error('Set default failed:', error.error);
      }
    } catch (error) {
      console.error('Error updating default payment method:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCardIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      default:
        return '💳';
    }
  };

  const formatCardBrand = (brand: string) => {
    return brand.charAt(0).toUpperCase() + brand.slice(1);
  };

  return (
    <div className="space-y-6">
      {showAddForm && (
        <AddPaymentMethodForm
          onSuccess={handleAddSuccess}
          onCancel={handleAddCancel}
        />
      )}
      
      <div className="bg-ps-secondary rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-ps-primary">
            Payment Methods
          </h2>
          <button
            onClick={handleAddPaymentMethod}
            disabled={isLoading || showAddForm}
            className="px-4 py-2 text-sm font-medium bg-ps-primary-600 text-white rounded-md hover:bg-ps-primary-700 transition-colors duration-200 disabled:opacity-50"
          >
            {showAddForm ? 'Adding...' : 'Add Payment Method'}
          </button>
        </div>

      {paymentMethods.length === 0 ? (
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
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-ps-primary mb-2">
            No Payment Methods
          </h3>
          <p className="text-ps-text-secondary">
            Add a payment method to manage your subscription and billing.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 border border-ps-border rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="text-2xl">
                  {getCardIcon(method.card.brand)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-ps-text-primary">
                      {formatCardBrand(method.card.brand)} •••• {method.card.last4}
                    </h3>
                    {method.isDefault && (
                      <span className="px-2 py-1 bg-ps-secondary-500 text-white text-xs rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-ps-text-secondary">
                    Expires {method.card.exp_month.toString().padStart(2, '0')}/
                    {method.card.exp_year.toString().slice(-2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {!method.isDefault && (
                  <button
                    onClick={() => handleSetDefault(method.id)}
                    disabled={isLoading}
                    className="px-3 py-1 text-sm text-ps-primary-600 hover:text-ps-primary-700 transition-colors duration-200 disabled:opacity-50"
                  >
                    {isLoading ? 'Setting...' : 'Set Default'}
                  </button>
                )}
                <button
                  onClick={() => handleDeletePaymentMethod(method.id)}
                  disabled={isLoading}
                  className="px-3 py-1 text-sm text-ps-accent-600 hover:text-ps-accent-700 transition-colors duration-200 disabled:opacity-50"
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {paymentMethods.length > 0 && (
        <div className="mt-6 p-4 bg-ps-neutral-50 rounded-lg">
          <p className="text-sm text-ps-text-secondary">
            <strong>Note:</strong> Your default payment method will be used for subscription renewals and any additional charges.
          </p>
        </div>
      )}
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import Link from 'next/link';
import ConfirmationModal from './ConfirmationModal';
import { cancelSubscription, reactivateSubscription } from '../../actions/account';
import { Subscription } from '../../../types/subscription';

type SubscriptionActionsProps = {
  subscription: Subscription;
  onUpdate: () => void;
};

export default function SubscriptionActions({ subscription, onUpdate }: SubscriptionActionsProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      const result = await cancelSubscription();
      
      if (result.success) {
        setActionMessage(result.message || 'Subscription canceled successfully');
        onUpdate(); // Refresh parent data
        setShowCancelModal(false);
        
        // Clear message after 3 seconds
        setTimeout(() => setActionMessage(''), 3000);
      } else {
        setActionMessage(result.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      setActionMessage('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReactivate = async () => {
    setIsLoading(true);
    try {
      const result = await reactivateSubscription();
      
      if (result.success) {
        setActionMessage(result.message || 'Subscription reactivated successfully');
        onUpdate(); // Refresh parent data
        setShowReactivateModal(false);
        
        // Clear message after 3 seconds
        setTimeout(() => setActionMessage(''), 3000);
      } else {
        setActionMessage(result.error || 'Failed to reactivate subscription');
      }
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      setActionMessage('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="pt-4 space-y-3">
      {/* Action Message */}
      {actionMessage && (
        <div className={`p-3 rounded-lg text-sm ${
          actionMessage.includes('success') || actionMessage.includes('reactivated')
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {actionMessage}
        </div>
      )}

      {/* Action Buttons */}
      {subscription.status === 'active' && !subscription.cancelAtPeriodEnd && (
        <button 
          onClick={() => setShowCancelModal(true)}
          className="w-full px-4 py-2 text-sm font-medium text-ps-accent-600 hover:text-ps-accent-700 transition-colors duration-200"
        >
          Cancel Subscription
        </button>
      )}
      
      {subscription.cancelAtPeriodEnd && (
        <button 
          onClick={() => setShowReactivateModal(true)}
          className="w-full px-4 py-2 text-sm font-medium bg-ps-primary-600 text-white rounded-md hover:bg-ps-primary-700 transition-colors duration-200"
        >
          Reactivate Subscription
        </button>
      )}

      <Link
        href="/pricing"
        className="block w-full px-4 py-2 text-sm font-medium text-center text-ps-primary-600 hover:text-ps-primary-700 transition-colors duration-200"
      >
        Change Plan
      </Link>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancel}
        title="Cancel Subscription"
        message={`Are you sure you want to cancel your subscription? It will remain active until ${formatDate(subscription.currentPeriodEnd)}, and you can reactivate it before then.`}
        confirmText="Cancel Subscription"
        isLoading={isLoading}
        type="danger"
      />

      <ConfirmationModal
        isOpen={showReactivateModal}
        onClose={() => setShowReactivateModal(false)}
        onConfirm={handleReactivate}
        title="Reactivate Subscription"
        message="Are you sure you want to reactivate your subscription? Billing will continue as normal."
        confirmText="Reactivate"
        isLoading={isLoading}
        type="primary"
      />
    </div>
  );
}
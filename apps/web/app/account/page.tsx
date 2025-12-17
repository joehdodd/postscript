'use client';
import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { requireAuth } from '../actions/auth';

import {
  fetchUserAccountData,
  fetchUserSubscription,
  fetchUserPaymentMethods,
  fetchUserInvoices,
} from '../actions/account';
import AccountNavigation from '../components/AccountNavigation';
import AccountInformation from '../components/AccountInformation';
import SubscriptionStatus from '../components/SubscriptionStatus/SubscriptionStatus';
import PaymentMethods from '../components/PaymentMethods';
import BillingHistory from '../components/BillingHistory';
import { Subscription } from '../../types/subscription';

export default function AccountPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userData, setUserData] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [invoices, setInvoices] = useState<any[]>([]);
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAccountData();
  }, []);

  const loadAccountData = async () => {
    try {
      setIsLoading(true);
      const authResult = await requireAuth();
      if (!authResult.userId) {
        redirect('/');
        return;
      }

      setUserId(authResult.userId);

      const [
        userDataResult,
        subscriptionResult,
        paymentMethodsResult,
        invoicesResult,
      ] = await Promise.all([
        fetchUserAccountData(),
        fetchUserSubscription(),
        fetchUserPaymentMethods(),
        fetchUserInvoices(),
      ]);

      setUserData(userDataResult);
      setSubscription(subscriptionResult);
      setPaymentMethods(paymentMethodsResult);
      setInvoices(invoicesResult);
    } catch (error) {
      console.error('Error loading account data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPaymentMethods = async () => {
    try {
      const result = await fetchUserPaymentMethods();
      setPaymentMethods(result);
    } catch (error) {
      console.error('Error refreshing payment methods:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ps-primary flex items-center justify-center">
        <div className="text-ps-text-primary">Loading your account...</div>
      </div>
    );
  }

  return (
    <div className="bg-ps-primary h-[calc(100vh-4rem)] overflow-y-scroll">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-ps-primary mb-2">
              Account & Billing
            </h1>
            <p className="text-ps-text-secondary">
              Manage your account information, subscription, and billing details
            </p>
          </div>
          {/* <AccountNavigation /> */}
          <div className="grid lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-8">
              <AccountInformation
                userData={userData}
                onUpdate={loadAccountData}
              />
              <PaymentMethods
                userId={userId}
                paymentMethods={paymentMethods}
                onRefresh={refreshPaymentMethods}
              />
              <BillingHistory userId={userId} invoices={invoices} />
            </div>
            <div className="lg:col-span-1">
              <SubscriptionStatus
                subscription={subscription || undefined}
                onUpdate={loadAccountData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

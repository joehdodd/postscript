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
import SubscriptionStatus from '../components/SubscriptionStatus';
import PaymentMethods from '../components/PaymentMethods';
import BillingHistory from '../components/BillingHistory';

export default async function AccountPage() {
  const { userId } = await requireAuth();
  if (!userId) {
    redirect('/');
  }

  // Fetch all account data in parallel
  const [userData, subscription, paymentMethods, invoices] = await Promise.all([
    fetchUserAccountData(),
    fetchUserSubscription(),
    fetchUserPaymentMethods(),
    fetchUserInvoices(),
  ]);

  return (
    <div className="min-h-screen bg-ps-primary">
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

          <AccountNavigation />

          <div className="grid lg:grid-cols-3 gap-8 mt-8">
            {/* Main Content 
            <div className="lg:col-span-2 space-y-8">
              <AccountInformation userData={userData} />
              <PaymentMethods userId={userId} paymentMethods={paymentMethods} />
              <BillingHistory userId={userId} invoices={invoices} />
            </div>
            */}

            {/* Sidebar 
            <div className="lg:col-span-1">
              <SubscriptionStatus userId={userId} subscription={subscription} />
            </div>
            */}
          </div>
        </div>
      </div>
    </div>
  );
}

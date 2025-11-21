'use server';

import { redirect } from 'next/navigation';
import { requireAuth } from './auth';
import { prisma } from '@repo/prisma';
import Stripe from 'stripe';

// Extend Stripe types for proper property access
interface StripeSubscriptionWithPeriods extends Stripe.Subscription {
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
}

interface StripeInvoiceWithPaymentIntent extends Stripe.Invoice {
  payment_intent?: {
    client_secret?: string;
  };
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

// Note: You'll need to add these fields to your User model in Prisma schema
type UpdateAccountData = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
};

export async function updateAccountInformation(data: UpdateAccountData) {
  const { userId } = await requireAuth();
  if (!userId) {
    redirect('/');
  }

  try {
    // Update user information in database
    await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        addressLine1: data.address?.line1,
        addressLine2: data.address?.line2,
        addressCity: data.address?.city,
        addressState: data.address?.state,
        addressPostalCode: data.address?.postal_code,
        addressCountry: data.address?.country,
      },
    });

    // Update Stripe customer if exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true, email: true },
    });

    if (user?.stripeCustomerId) {
      await stripe.customers.update(user.stripeCustomerId, {
        name: [data.firstName, data.lastName].filter(Boolean).join(' '),
        phone: data.phone,
        address: data.address ? {
          line1: data.address.line1,
          line2: data.address.line2,
          city: data.address.city,
          state: data.address.state,
          postal_code: data.address.postal_code,
          country: data.address.country,
        } : undefined,
      });
    }

    return { success: true, message: 'Account information updated successfully' };
  } catch (error) {
    console.error('Error updating account information:', error);
    return { success: false, message: 'Failed to update account information' };
  }
}

export async function fetchUserAccountData() {
  const { userId } = await requireAuth();
  if (!userId) {
    redirect('/');
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        addressLine1: true,
        addressLine2: true,
        addressCity: true,
        addressState: true,
        addressPostalCode: true,
        addressCountry: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      ...user,
      address: {
        line1: user.addressLine1 || '',
        line2: user.addressLine2 || '',
        city: user.addressCity || '',
        state: user.addressState || '',
        postal_code: user.addressPostalCode || '',
        country: user.addressCountry || 'US',
      },
    };
  } catch (error) {
    console.error('Error fetching user account data:', error);
    return null;
  }
}

export async function fetchUserSubscription() {
  const { userId } = await requireAuth();
  if (!userId) {
    redirect('/');
  }

  try {
    const subscription = await prisma.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) {
      return null; // No subscription (free plan)
    }

    // Get fresh data from Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId,
      { expand: ['latest_invoice'] }
    ) as unknown as StripeSubscriptionWithPeriods;
    console.log('Stripeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee Subscription:', stripeSubscription);

    return {
      id: subscription.stripeSubscriptionId,
      status: stripeSubscription.status,
      planType: subscription.planType,
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      canceledAt: subscription.canceledAt,
    };
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    return null;
  }
}

export async function fetchUserPaymentMethods() {
  const { userId } = await requireAuth();
  if (!userId) {
    redirect('/');
  }

  try {
    // Get customer from database first
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId) {
      return [];
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: 'card',
    });

    // Get default payment method from customer
    const customer = await stripe.customers.retrieve(user.stripeCustomerId) as Stripe.Customer;
    const defaultPaymentMethodId = customer.invoice_settings.default_payment_method as string;

    return paymentMethods.data.map((pm) => ({
      id: pm.id,
      type: pm.type,
      card: pm.card ? {
        brand: pm.card.brand,
        last4: pm.card.last4,
        exp_month: pm.card.exp_month,
        exp_year: pm.card.exp_year,
      } : null,
      isDefault: pm.id === defaultPaymentMethodId,
    }));
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
}

export async function fetchUserInvoices() {
  const { userId } = await requireAuth();
  if (!userId) {
    redirect('/');
  }

  try {
    // Get customer from database first
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId) {
      return [];
    }

    const invoices = await stripe.invoices.list({
      customer: user.stripeCustomerId,
      limit: 20,
      status: 'paid',
    });

    return invoices.data.map((invoice) => ({
      id: invoice.id,
      date: new Date(invoice.created * 1000),
      amount: invoice.total,
      currency: invoice.currency,
      status: invoice.status,
      description: invoice.description || invoice.lines.data[0]?.description || 'Subscription',
      invoiceUrl: invoice.invoice_pdf,
      receiptUrl: invoice.receipt_number ? `https://pay.stripe.com/receipts/${invoice.receipt_number}` : undefined,
    }));
  } catch (error) {
    console.error('Error fetching user invoices:', error);
    return [];
  }
}

// Helper function to create or get Stripe customer
export async function createOrGetStripeCustomer(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { 
      stripeCustomerId: true, 
      email: true, 
      firstName: true, 
      lastName: true 
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Return existing customer if available
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email: user.email,
    name: [user.firstName, user.lastName].filter(Boolean).join(' '),
    metadata: {
      userId: userId,
    },
  });

  // Update user with Stripe customer ID
  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

// Function to handle subscription creation
export async function createSubscription(userId: string, priceId: string) {
  try {
    const customerId = await createOrGetStripeCustomer(userId);

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    }) as unknown as StripeSubscriptionWithPeriods & {
      latest_invoice: StripeInvoiceWithPaymentIntent;
    };

    // Store subscription in database
    await prisma.subscription.create({
      data: {
        userId,
        stripeSubscriptionId: subscription.id,
        status: subscription.status.toUpperCase() as 'ACTIVE' | 'CANCELED' | 'INCOMPLETE' | 'PAST_DUE' | 'TRIALING' | 'UNPAID',
        planType: 'PREMIUM',
        stripePriceId: priceId,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });

    const latestInvoice = subscription.latest_invoice;
    const paymentIntent = latestInvoice?.payment_intent;
    return {
      subscriptionId: subscription.id,
      clientSecret: paymentIntent?.client_secret,
    };
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

// Subscription Management Functions

export async function cancelSubscription() {
  'use server';
  
  const { userId } = await requireAuth();
  if (!userId) {
    redirect('/');
  }

  try {
    // Get user's active subscription
    const subscription = await prisma.subscription.findFirst({
      where: { 
        userId,
        status: 'ACTIVE'
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) {
      return {
        success: false,
        error: 'No active subscription found'
      };
    }

    // Cancel subscription in Stripe (at period end)
    const stripeSubscription = await stripe.subscriptions.update(
      subscription.stripeSubscriptionId,
      {
        cancel_at_period_end: true,
      }
    ) as unknown as StripeSubscriptionWithPeriods;

    // Update subscription in database
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: true,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      message: 'Subscription will be canceled at the end of the current period',
      data: {
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      },
    };

  } catch (error) {
    console.error('Error canceling subscription:', error);
    return {
      success: false,
      error: 'Failed to cancel subscription'
    };
  }
}

export async function reactivateSubscription() {
  'use server';
  
  const { userId } = await requireAuth();
  if (!userId) {
    redirect('/');
  }

  try {
    // Get user's subscription that's set to cancel
    const subscription = await prisma.subscription.findFirst({
      where: { 
        userId,
        status: 'ACTIVE',
        cancelAtPeriodEnd: true
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) {
      return {
        success: false,
        error: 'No subscription found to reactivate'
      };
    }

    // Reactivate subscription in Stripe
    const stripeSubscription = await stripe.subscriptions.update(
      subscription.stripeSubscriptionId,
      {
        cancel_at_period_end: false,
      }
    ) as unknown as StripeSubscriptionWithPeriods;

    // Update subscription in database
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: false,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      message: 'Subscription reactivated successfully',
      data: {
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      },
    };

  } catch (error) {
    console.error('Error reactivating subscription:', error);
    return {
      success: false,
      error: 'Failed to reactivate subscription'
    };
  }
}
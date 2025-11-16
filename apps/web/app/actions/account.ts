'use server';

import { redirect } from 'next/navigation';
import { requireAuth } from './auth';

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
    // TODO: Update user information in database
    // You'll need to update your Prisma schema and add these fields to the User model
    /*
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
    */

    console.log('Account information updated for user:', userId, 'with data:', data);
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
    // TODO: Fetch user data from database
    /*
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
    */

    // Temporary mock data - replace with actual database call
    return {
      id: userId,
      email: 'user@example.com',
      firstName: '',
      lastName: '',
      phone: '',
      address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'US',
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
    // TODO: Fetch subscription data from Stripe and/or database
    /*
    const subscription = await prisma.subscription.findFirst({
      where: { userId },
      include: {
        plan: true,
      },
    });

    if (!subscription) {
      return null; // No subscription (free plan)
    }

    return {
      id: subscription.stripeSubscriptionId,
      status: subscription.status,
      planName: subscription.plan.name,
      planPrice: subscription.plan.price,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    };
    */

    // Temporary mock data - replace with actual Stripe/database call
    return null; // No subscription (free plan)
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
    // TODO: Fetch payment methods from Stripe
    /*
    const stripe = new Stripe(getStripeSecretKey());
    
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

    return paymentMethods.data.map((pm) => ({
      id: pm.id,
      type: pm.type,
      card: pm.card,
      isDefault: pm.id === user.defaultPaymentMethodId, // You'd need to track this
    }));
    */

    // Temporary mock data - replace with actual Stripe call
    return [];
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
    // TODO: Fetch invoices from Stripe
    /*
    const stripe = new Stripe(getStripeSecretKey());
    
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
    });

    return invoices.data.map((invoice) => ({
      id: invoice.id,
      date: new Date(invoice.created * 1000),
      amount: invoice.total,
      status: invoice.status,
      description: invoice.description || `${invoice.lines.data[0]?.description}`,
      invoiceUrl: invoice.invoice_pdf,
      receiptUrl: invoice.receipt_number ? invoice.receipt_url : undefined,
    }));
    */

    // Temporary mock data - replace with actual Stripe call
    return [];
  } catch (error) {
    console.error('Error fetching user invoices:', error);
    return [];
  }
}
import Stripe from 'stripe';
import { prisma } from '@repo/prisma';

// Extend Stripe types for proper property access
interface StripeSubscriptionWithPeriods extends Stripe.Subscription {
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

export interface BillingSuccessResult {
  success: boolean;
  planName: string;
  amount: string;
  subscriptionCreated: boolean;
  error?: string;
}

export async function processBillingSuccess(
  sessionId: string,
  userId: string
): Promise<BillingSuccessResult> {
  try {
    // Retrieve the session from Stripe to verify the payment
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'line_items.data.price.product', 'subscription']
    });

    // Verify payment was successful
    if (session.payment_status !== 'paid') {
      return {
        success: false,
        planName: '',
        amount: '',
        subscriptionCreated: false,
        error: 'Payment was not successful'
      };
    }

    // Extract plan details from the session
    const planDetails = extractPlanDetails(session);
    
    // Ensure subscription is created in our database (fallback if webhook hasn't fired yet)
    const subscriptionCreated = await ensureSubscriptionCreated(session, userId);

    return {
      success: true,
      planName: planDetails.planName,
      amount: planDetails.amount,
      subscriptionCreated,
    };

  } catch (error) {
    console.error('Error processing billing success:', error);
    return {
      success: false,
      planName: '',
      amount: '',
      subscriptionCreated: false,
      error: 'Failed to process billing success'
    };
  }
}

function extractPlanDetails(session: Stripe.Checkout.Session): {
  planName: string;
  amount: string;
} {
  let planName = 'Premium';
  let amount = '';

  if (session.line_items?.data[0]) {
    const lineItem = session.line_items.data[0];
    const price = lineItem.price;
    
    if (price) {
      // Format the amount
      amount = `$${(price.unit_amount! / 100).toFixed(2)}`;
      
      // Get plan name from price metadata or product name
      if (price.metadata?.plan_name) {
        planName = price.metadata.plan_name;
      } else if (price.product && typeof price.product === 'object' && 'name' in price.product && price.product.name) {
        planName = price.product.name;
      } else {
        // Fallback based on amount
        planName = price.unit_amount === 250 ? 'Gold' : 'Platinum';
      }
    }
  }

  return { planName, amount };
}

async function ensureSubscriptionCreated(
  session: Stripe.Checkout.Session,
  userId: string
): Promise<boolean> {
  if (!session.subscription) {
    return false;
  }

  try {
    const stripeSubscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    ) as unknown as StripeSubscriptionWithPeriods;
    // Check if subscription already exists in our database
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        stripeSubscriptionId: stripeSubscription.id,
        userId: userId,
      },
    });

    if (!existingSubscription) {
      // Create subscription in our database
      await prisma.subscription.create({
        data: {
          userId: userId,
          stripeSubscriptionId: stripeSubscription.id,
          status: stripeSubscription.status.toUpperCase() as 'ACTIVE' | 'CANCELED' | 'INCOMPLETE' | 'PAST_DUE' | 'TRIALING' | 'UNPAID',
          planType: 'PREMIUM' as 'FREE' | 'PREMIUM',
          stripePriceId: stripeSubscription.items.data[0]?.price.id || '',
          currentPeriodStart: convertUnixTimestampToDate(stripeSubscription.current_period_start),
          currentPeriodEnd: convertUnixTimestampToDate(stripeSubscription.current_period_end),
          cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end || false,
        },
      });

      // Update user's Stripe customer ID if not set
      await updateUserStripeCustomerId(userId, stripeSubscription.customer as string);
      
      return true;
    }

    return false;
  } catch (dbError) {
    console.error('Error creating subscription in database:', dbError);
    // Don't throw - webhook will handle this
    return false;
  }
}

function convertUnixTimestampToDate(timestamp: number): Date {
  // Validate that timestamp is a valid number
  if (!timestamp || typeof timestamp !== 'number' || timestamp <= 0) {
    console.error('Invalid Unix timestamp:', timestamp);
    return new Date(); // Fallback to current date
  }
  
  // Convert Unix timestamp (seconds) to JavaScript Date (milliseconds)
  const date = new Date(timestamp * 1000);
  
  // Validate the resulting date
  if (isNaN(date.getTime())) {
    console.error('Invalid date created from timestamp:', timestamp);
    return new Date(); // Fallback to current date
  }
  
  return date;
}

async function updateUserStripeCustomerId(userId: string, customerId: string): Promise<void> {
  if (!customerId) return;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          stripeCustomerId: customerId,
        },
      });
    }
  } catch (error) {
    console.error('Error updating user Stripe customer ID:', error);
  }
}
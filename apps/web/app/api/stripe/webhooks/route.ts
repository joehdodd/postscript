import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripeSecretKey } from '../../../../lib/stripe';
import { prisma } from '@repo/prisma';

// Extend Stripe types to include properties that exist in API but not in types
interface StripeInvoiceWithSubscription extends Stripe.Invoice {
  subscription?: string | Stripe.Subscription;
}

interface StripeSubscriptionWithPeriods extends Stripe.Subscription {
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
}

const stripe = new Stripe(getStripeSecretKey(), {
  apiVersion: '2025-10-29.clover',
});

function getWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('STRIPE_WEBHOOK_SECRET environment variable is not set');
  }
  return secret;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, getWebhookSecret());
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle different event types
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Payment succeeded:', session.id);
      
      // Get the subscription from the session
      if (session.subscription && session.client_reference_id) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string) as unknown as StripeSubscriptionWithPeriods;
        await handleSubscriptionUpdate(subscription, session.client_reference_id);
      }
      break;
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as unknown as StripeSubscriptionWithPeriods;
      console.log('Subscription updated:', subscription.id);
      
      // Find user by Stripe customer ID
      const user = await prisma.user.findUnique({
        where: { stripeCustomerId: subscription.customer as string },
      });

      if (user) {
        await handleSubscriptionUpdate(subscription, user.id);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('Subscription canceled:', subscription.id);
      
      // Mark subscription as canceled in database
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          status: 'CANCELED',
          canceledAt: new Date(),
        },
      });
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as StripeInvoiceWithSubscription;
      console.log('Invoice payment succeeded:', invoice.id);
      
      // Update subscription period if needed
      if (invoice.subscription) {
        const subscriptionId = typeof invoice.subscription === 'string' 
          ? invoice.subscription 
          : invoice.subscription.id;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId) as unknown as StripeSubscriptionWithPeriods;
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: subscription.customer as string },
        });

        if (user) {
          await prisma.subscription.updateMany({
            where: {
              userId: user.id,
              stripeSubscriptionId: subscription.id,
            },
            data: {
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              status: subscription.status.toUpperCase() as 'ACTIVE' | 'CANCELED' | 'INCOMPLETE' | 'PAST_DUE' | 'TRIALING' | 'UNPAID',
            },
          });
        }
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as StripeInvoiceWithSubscription;
      console.log('Invoice payment failed:', invoice.id);
      
      // Update subscription status to past due
      if (invoice.subscription) {
        const subscriptionId = typeof invoice.subscription === 'string' 
          ? invoice.subscription 
          : invoice.subscription.id;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: {
            status: 'PAST_DUE',
          },
        });
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleSubscriptionUpdate(subscription: StripeSubscriptionWithPeriods, userId: string) {
  const subscriptionData = {
    userId,
    stripeSubscriptionId: subscription.id,
    status: subscription.status.toUpperCase() as 'ACTIVE' | 'CANCELED' | 'INCOMPLETE' | 'PAST_DUE' | 'TRIALING' | 'UNPAID',
    planType: 'PREMIUM' as 'FREE' | 'PREMIUM', // You can determine this from the price ID
    stripePriceId: subscription.items.data[0]?.price.id || '',
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  };

  // Try to update existing subscription, create if it doesn't exist
  const existingSubscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (existingSubscription) {
    await prisma.subscription.update({
      where: { id: existingSubscription.id },
      data: subscriptionData,
    });
  } else {
    await prisma.subscription.create({
      data: subscriptionData,
    });
  }
}
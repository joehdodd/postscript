import { NextResponse } from 'next/server';
import { stripe } from '../../../../lib/stripe';
import { requireAuth } from '../../../actions/auth';
import { createOrGetStripeCustomer } from '../../../actions/account';

// POST /api/stripe/setup-intent - Create a new setup intent for adding payment methods
export async function POST() {
  try {
    const { userId } = await requireAuth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create Stripe customer
    const customerId = await createOrGetStripeCustomer(userId);

    // Create setup intent for adding payment method
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      usage: 'off_session',
      payment_method_types: ['card'],
    });

    return NextResponse.json({
      clientSecret: setupIntent.client_secret,
    });
  } catch (error) {
    console.error('Setup intent creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create setup intent' },
      { status: 500 }
    );
  }
}
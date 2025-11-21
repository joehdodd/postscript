import { type Stripe } from 'stripe';

export type Subscription = {
  id: string;
  status: Stripe.Subscription.Status;
  planType: string;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date | null;
};

import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia', // Latest stable API version
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, donationType, isRecurring } = req.body;

  if (!amount || amount < 1) {
    return res.status(400).json({ error: 'Valid amount is required' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: isRecurring ? 'Monthly Donation' : 'One-time Donation',
              description: `Donation to Kelly's Angels Inc. (${donationType || 'General'})`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
            recurring: isRecurring ? { interval: 'month' } : undefined,
          },
          quantity: 1,
        },
      ],
      mode: isRecurring ? 'subscription' : 'payment',
      success_url: `${req.headers.origin}/donate?success=true`,
      cancel_url: `${req.headers.origin}/donate?canceled=true`,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ 
      error: 'Error creating checkout session', 
      details: err instanceof Error ? err.message : 'Unknown error' 
    });
  }
}
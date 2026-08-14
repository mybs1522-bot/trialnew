import Stripe from 'stripe';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const secretKey = process.env.STRIPE_SECRET_KEY || process.env.VITE_STRIPE_SECRET_KEY;

    if (!secretKey) {
      console.error('[Stripe Server] STRIPE_SECRET_KEY environment variable is missing on Vercel.');
      return res.status(500).json({
        error: 'Stripe Secret Key missing. Please add STRIPE_SECRET_KEY in Vercel Project Settings -> Environment Variables and redeploy.',
      });
    }

    const stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16',
    });

    const {
      product_name = 'Avada Architecture Pass',
      monthly_price = 20,
      trial_days = 3,
      customer_name = '',
      customer_email = '',
      customer_phone = '',
      origin = 'http://localhost:4000',
    } = req.body || {};

    const amountInCents = Math.round(Number(monthly_price) * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product_name,
              description: `3-Day Free Trial, then $${monthly_price}/month`,
              images: [
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80',
              ],
            },
            unit_amount: amountInCents,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: Number(trial_days),
      },
      customer_email: customer_email ? customer_email.trim() : undefined,
      metadata: {
        customer_name,
        customer_email,
        customer_phone,
      },
      success_url: `${origin}/portal?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${origin}/?canceled=true`,
    });

    return res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

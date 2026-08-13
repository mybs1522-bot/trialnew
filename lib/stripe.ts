import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey =
  ((import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY) ||
  'pk_live_51PRJCsGGsoQTkhyv6OrT4zvnaaB5Y0MSSkTXi0ytj33oygsfW3dcu6aOFa9q3dr2mXYTCJErnFQJcOcyuDAsQd4B00lIAdclbB';

export const stripePromise = loadStripe(stripePublishableKey);

export const createStripeCheckoutSession = async (
  details: {
    monthlyPrice: number;
    trialDays: number;
    productName: string;
  },
  customerDetails?: { name?: string; email: string; phone?: string }
): Promise<{ clientSecret?: string; url?: string; error?: string }> => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_name: details.productName,
        monthly_price: details.monthlyPrice,
        trial_days: details.trialDays,
        customer_name: customerDetails?.name || '',
        customer_email: customerDetails?.email || '',
        customer_phone: customerDetails?.phone || '',
        origin: window.location.origin,
      }),
    });

    const data = await response.json();
    if (response.ok && (data.clientSecret || data.url)) {
      if (customerDetails?.email) {
        localStorage.setItem(
          'pending_student_checkout',
          JSON.stringify({
            name: customerDetails.name || customerDetails.email.split('@')[0],
            email: customerDetails.email,
            phone: customerDetails.phone || '',
            timestamp: Date.now(),
          })
        );
      }
      return data;
    }
    return { error: data.error || 'Failed to initialize payment session' };
  } catch (err: any) {
    return { error: err.message || 'Network error' };
  }
};

export const triggerStripeSubscriptionCheckout = async (
  details: {
    monthlyPrice: number;
    trialDays: number;
    productName: string;
  },
  customerDetails?: { name: string; email: string; phone: string },
  onFailure?: (error: any) => void
) => {
  const result = await createStripeCheckoutSession(details, customerDetails);
  if (result.url) {
    window.location.href = result.url;
  } else if (result.error) {
    alert(result.error);
    if (onFailure) onFailure(result.error);
  }
};

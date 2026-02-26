# Stripe Payment Integration Setup

## Overview
Kelly's Angels website now has a fully functional Stripe payment integration for processing donations.

## What's Been Implemented

### 1. Donate Page (`/donate`)
- One-time and recurring (monthly) donation options
- Preset amounts ($25, $50, $100, $250) and custom amount input
- Secure Stripe Checkout flow
- Success/error handling with user feedback
- Mobile-responsive design

### 2. API Route (`/api/create-checkout-session`)
- Server-side Stripe session creation
- Handles both one-time payments and subscriptions
- Proper error handling and validation
- Secure server-side processing

### 3. Stripe Client Library (`/lib/getStripe.ts`)
- Loads Stripe.js securely
- Caches the Stripe instance for performance

## Required Environment Variables

Add these to your `.env.local` file (accessible in Softgen Settings → Environment tab):

```bash
# Stripe Publishable Key (client-side, safe to expose)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxx...

# Stripe Secret Key (server-side only, NEVER expose publicly)
STRIPE_SECRET_KEY=sk_test_51xxxxx...
```

## Getting Your Stripe Keys

1. Go to https://dashboard.stripe.com/apikeys
2. Sign in or create a Stripe account
3. You'll see two types of keys:
   - **Test keys** (for development): `pk_test_...` and `sk_test_...`
   - **Live keys** (for production): `pk_live_...` and `sk_live_...`

### For Testing (Development)
Use the **test keys**. You can use Stripe's test card numbers:
- Success: `4242 4242 4242 4242`
- Any future expiration date
- Any 3-digit CVC
- Any ZIP code

### For Production (Real Payments)
1. Complete Stripe account verification
2. Switch to **live keys**
3. Update your environment variables with live keys

## Testing the Integration

1. Add the test keys to `.env.local`
2. Restart your Next.js server (click "Restart Server" in Softgen)
3. Visit `/donate` on your site
4. Select an amount and click "Donate"
5. Use test card `4242 4242 4242 4242` to complete checkout
6. You should be redirected back with a success message

## Important Security Notes

- ✅ **Never commit** your `.env.local` file or Stripe secret keys to Git
- ✅ Secret keys (starting with `sk_`) must **only** be used server-side
- ✅ Publishable keys (starting with `pk_`) are safe to use client-side
- ✅ Test keys are for development only - use live keys for production
- ✅ Stripe handles all sensitive payment data - your server never sees card numbers

## Webhook Setup (Optional - for advanced features)

If you want to track payment events (successful payments, failed payments, subscription cancellations), set up webhooks:

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter your webhook URL: `https://yourdomain.com/api/stripe-webhook`
4. Select events to listen to (e.g., `checkout.session.completed`)
5. Add the webhook signing secret to your `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

## Troubleshooting

### "Stripe failed to load" error
- Check that `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set correctly
- Ensure the key starts with `pk_test_` or `pk_live_`
- Restart the Next.js server after adding environment variables

### "Error creating checkout session"
- Verify `STRIPE_SECRET_KEY` is set correctly on the server
- Check that the key starts with `sk_test_` or `sk_live_`
- Look at the server logs for detailed error messages

### Payments not processing
- Ensure you're using test card numbers in test mode
- Check Stripe Dashboard logs at https://dashboard.stripe.com/logs
- Verify your Stripe account is in good standing

## Support

- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
- Test your integration: https://dashboard.stripe.com/test/payments
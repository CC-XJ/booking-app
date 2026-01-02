import { serve } from "std/http/server.ts";
import Stripe from "stripe";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 2. Handle the CORS preflight "OPTIONS" request (required by browsers/mobile)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 3. Initialize Stripe
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("Missing STRIPE_SECRET_KEY environment variable");
    }

    const stripe = new Stripe(stripeSecretKey, {
      httpClient: Stripe.createFetchHttpClient(),
    });

    // 4. Parse request body
    const { amount, currency, customerEmail } = await req.json();

    // 5. Create the PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents (e.g., 1000 = $10.00)
      currency: currency || 'usd',
      receipt_email: customerEmail,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // 6. Return the Client Secret with CORS headers
    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }, 
        status: 200 
      }
    );

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Stripe Error:", message);

    return new Response(
      JSON.stringify({ error: message }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
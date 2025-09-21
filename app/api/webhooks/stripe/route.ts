import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getStripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Forzar que esta ruta sea dinámica
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Verificar que todas las variables de entorno estén disponibles
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET || 
        !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Required environment variables not configured');
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
    }

    const body = await req.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    // Verificar el webhook
    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Verificar que las variables de entorno estén disponibles
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Supabase environment variables not configured');
      return NextResponse.json({ error: 'Database configuration error' }, { status: 500 });
    }

    // Crear cliente de Supabase con Service Role Key (sin autenticación de usuario)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (!userId) {
          console.error('User ID not found in subscription metadata.');
          return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
        }

        const { error: upsertError } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            plan_id: subscription.items.data[0].price.lookup_key as string,
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: subscription.customer as string,
          }, { onConflict: 'stripe_subscription_id' });

        if (upsertError) {
          console.error('Error upserting subscription:', upsertError);
          return NextResponse.json({ error: `Database Error: ${upsertError.message}` }, { status: 500 });
        }
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;
        const { error: deleteError } = await supabase
          .from('subscriptions')
          .delete()
          .eq('stripe_subscription_id', deletedSubscription.id);

        if (deleteError) {
          console.error('Error deleting subscription:', deleteError);
          return NextResponse.json({ error: `Database Error: ${deleteError.message}` }, { status: 500 });
        }
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Invoice payment succeeded:', invoice.id);
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        console.log('Invoice payment failed:', failedInvoice.id);
        break;

      default:
        console.warn(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 400 });
  }
}

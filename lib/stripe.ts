import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-08-27.basil',
    });
  }
  return stripeInstance;
}

// Exportar stripe solo cuando esté disponible
export const stripe = (() => {
  try {
    return getStripe();
  } catch {
    return null;
  }
})();

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    annual: number;
  };
  features: string[];
  limits: {
    patients: number | 'unlimited';
    storageGB: number;
    aiFeatures: boolean;
    advancedReports: boolean;
    googleCalendar: boolean;
  };
  popular?: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter Plan',
    description: 'Plan competitivo para psicólogos en crecimiento',
    price: {
      monthly: 29,
      annual: 26,
    },
    features: [
      'Hasta 50 pacientes',
      '1GB de almacenamiento',
      'Gestión básica de citas',
      'Notas clínicas básicas',
      'Soporte por email',
      'Cumplimiento HIPAA',
    ],
    limits: {
      patients: 50,
      storageGB: 1,
      aiFeatures: false,
      advancedReports: false,
      googleCalendar: false,
    },
  },
  {
    id: 'professional',
    name: 'Professional Plan',
    description: 'El plan más popular - Ideal para psicólogos establecidos',
    price: {
      monthly: 59,
      annual: 53,
    },
    features: [
      'Hasta 200 pacientes',
      '5GB de almacenamiento',
      'IA para resúmenes',
      'Reportes avanzados',
      'Soporte prioritario',
      'Google Calendar',
      'Cumplimiento HIPAA',
    ],
    limits: {
      patients: 200,
      storageGB: 5,
      aiFeatures: true,
      advancedReports: true,
      googleCalendar: true,
    },
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    description: 'Solución empresarial con almacenamiento casi ilimitado',
    price: {
      monthly: 149,
      annual: 134,
    },
    features: [
      'Pacientes ilimitados',
      '50GB de almacenamiento',
      'IA para resúmenes',
      'Reportes avanzados',
      'Soporte prioritario',
      'Google Calendar',
      'Cumplimiento HIPAA',
    ],
    limits: {
      patients: 'unlimited',
      storageGB: 50,
      aiFeatures: true,
      advancedReports: true,
      googleCalendar: true,
    },
  },
];

// Crear productos y precios en Stripe
export async function createStripeProducts() {
  try {
    const products = [];
    
    for (const plan of SUBSCRIPTION_PLANS) {
      // Crear producto
      if (!stripe) {
        throw new Error('Stripe not initialized');
      }
      const product = await stripe.products.create({
        name: plan.name,
        description: plan.description,
        metadata: {
          planId: plan.id,
          limits: JSON.stringify(plan.limits),
        },
      });

      // Crear precio mensual
      if (!stripe) {
        throw new Error('Stripe not initialized');
      }
      const monthlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.price.monthly * 100, // Convertir a centavos
        currency: 'eur',
        recurring: {
          interval: 'month',
        },
        metadata: {
          planId: plan.id,
          interval: 'month',
        },
      });

      // Crear precio anual
      if (!stripe) {
        throw new Error('Stripe not initialized');
      }
      const annualPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.price.annual * 100, // Convertir a centavos
        currency: 'eur',
        recurring: {
          interval: 'year',
        },
        metadata: {
          planId: plan.id,
          interval: 'year',
        },
      });

      products.push({
        product,
        monthlyPrice,
        annualPrice,
      });
    }

    return products;
  } catch (error) {
    console.error('Error creating Stripe products:', error);
    throw error;
  }
}

// Crear sesión de checkout para suscripción
export async function createCheckoutSession({
  planId,
  interval,
  userEmail,
  userId,
}: {
  planId: string;
  interval: 'month' | 'year';
  userEmail: string;
  userId: string;
}) {
  if (!stripe) {
    throw new Error('Stripe not initialized');
  }

  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
  if (!plan) {
    throw new Error('Plan not found');
  }

  const amount = interval === 'month' ? plan.price.monthly : plan.price.annual;

  const checkoutSession = await stripe.checkout.sessions.create({
    customer_email: userEmail,
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: plan.name,
            description: `Suscripción ${interval === 'month' ? 'mensual' : 'anual'}`,
          },
          unit_amount: amount * 100, // Convertir a centavos
          recurring: {
            interval: interval,
          },
        },
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription?canceled=true`,
    metadata: {
      userId,
      planId,
      interval,
    },
  });

  return { url: checkoutSession.url };
}

// Crear sesión del portal del cliente
export async function createCustomerPortalSession(customerId: string) {
  if (!stripe) {
    throw new Error('Stripe not initialized');
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });

  return { url: portalSession.url };
}

'use server'

import { auth } from '@clerk/nextjs/server'
import { createSupabaseClient } from '@/lib/supabase'
import { createCheckoutSession, createCustomerPortalSession, stripe } from '@/lib/stripe'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export interface UserSubscription {
  id: string
  userId: string
  planId: string
  status: 'active' | 'canceled' | 'past_due' | 'unpaid'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  stripeSubscriptionId: string
  stripeCustomerId: string
  createdAt: string
  updatedAt: string
}

// Crear sesión de checkout para suscripción
export async function createSubscriptionCheckout({
  planId,
  interval,
}: {
  planId: string
  interval: 'month' | 'year'
}) {
  try {
    const { userId, sessionClaims } = await auth()
    
    if (!userId) {
      throw new Error('Usuario no autenticado')
    }

    const userEmail = sessionClaims?.email as string
    if (!userEmail) {
      throw new Error('Email del usuario no encontrado')
    }

    const checkoutSession = await createCheckoutSession({
      planId,
      interval,
      userId,
      userEmail,
    })

    return { url: checkoutSession.url }
  } catch (error) {
    console.error('Error creating subscription checkout:', error)
    throw error
  }
}

// Crear sesión del portal del cliente
export async function createSubscriptionPortal() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      throw new Error('Usuario no autenticado')
    }

    const supabase = createSupabaseClient()
    
    // Obtener la suscripción del usuario
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (!subscription) {
      throw new Error('No se encontró suscripción activa')
    }

    const portalSession = await createCustomerPortalSession(subscription.stripe_customer_id)
    
    return { url: portalSession.url }
  } catch (error) {
    console.error('Error creating subscription portal:', error)
    throw error
  }
}

// Obtener suscripción actual del usuario
export async function getCurrentSubscription(): Promise<UserSubscription | null> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return null
    }

    const supabase = createSupabaseClient()
    
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    return subscription
  } catch (error) {
    console.error('Error getting current subscription:', error)
    return null
  }
}

// Verificar si el usuario tiene un plan específico
export async function hasPlan(planId: string): Promise<boolean> {
  try {
    const subscription = await getCurrentSubscription()
    return subscription?.planId === planId
  } catch (error) {
    console.error('Error checking plan:', error)
    return false
  }
}

// Verificar si el usuario puede usar una característica específica
export async function hasFeature(feature: string): Promise<boolean> {
  try {
    const subscription = await getCurrentSubscription()
    
    if (!subscription) {
      return false
    }

    // Lógica para verificar características basada en el plan
    switch (subscription.planId) {
      case 'starter':
        return ['basic_appointments', 'basic_notes', 'email_support'].includes(feature)
      case 'professional':
        return ['basic_appointments', 'basic_notes', 'email_support', 'ai_features', 'advanced_reports', 'google_calendar'].includes(feature)
      case 'enterprise':
        return true // Todas las características
      default:
        return false
    }
  } catch (error) {
    console.error('Error checking feature:', error)
    return false
  }
}

// Manejar webhook de Stripe
export async function handleStripeWebhook(event: any) {
  try {
    // Para webhooks, usar Service Role Key (sin autenticación de usuario)
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object
        
        // Buscar el usuario por el customer ID
        const { data: existingSubscription } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('stripe_subscription_id', subscription.id)
          .single()

        const subscriptionData = {
          user_id: subscription.metadata.userId,
          plan_id: subscription.metadata.planId,
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
          stripe_subscription_id: subscription.id,
          stripe_customer_id: subscription.customer,
          updated_at: new Date().toISOString(),
        }

        if (existingSubscription) {
          // Actualizar suscripción existente
          await supabase
            .from('subscriptions')
            .update(subscriptionData)
            .eq('id', existingSubscription.id)
        } else {
          // Crear nueva suscripción
          await supabase
            .from('subscriptions')
            .insert({
              ...subscriptionData,
              created_at: new Date().toISOString(),
            })
        }
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object
        
        await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', deletedSubscription.id)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Error handling Stripe webhook:', error)
    throw error
  }
}

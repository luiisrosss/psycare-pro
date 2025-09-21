'use server'

import { auth } from '@clerk/nextjs/server'
import { createSupabaseClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export interface PsychologistProfile {
  id?: string
  user_id: string
  name: string
  email: string
  phone?: string
  address?: string
  tax_id?: string
  specialization?: string
  license_number?: string
  bio?: string
  created_at?: string
  updated_at?: string
}

export interface BillingSettings {
  id?: string
  psychologist_id: string
  bank_name?: string
  iban?: string
  swift?: string
  payment_terms?: string
  currency: string
  tax_rate: number
  created_at?: string
  updated_at?: string
}

export interface NotificationSettings {
  id?: string
  psychologist_id: string
  email_notifications: boolean
  appointment_reminders: boolean
  payment_reminders: boolean
  weekly_reports: boolean
  marketing_emails: boolean
  created_at?: string
  updated_at?: string
}

// Obtener perfil del psicólogo
export async function getPsychologistProfile(): Promise<PsychologistProfile | null> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return null
    }

    const supabase = createSupabaseClient()
    
    const { data: profile, error } = await supabase
      .from('psychologists')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching psychologist profile:', error)
      return null
    }

    return profile
  } catch (error) {
    console.error('Error getting psychologist profile:', error)
    return null
  }
}

// Actualizar perfil del psicólogo
export async function updatePsychologistProfile(profileData: Partial<PsychologistProfile>): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return { success: false, error: 'Usuario no autenticado' }
    }

    const supabase = createSupabaseClient()
    
    const { error } = await supabase
      .from('psychologists')
      .upsert({
        user_id: userId,
        ...profileData,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })

    if (error) {
      console.error('Error updating psychologist profile:', error)
      return { success: false, error: 'Error al actualizar el perfil' }
    }

    revalidatePath('/configuracion')
    return { success: true }
  } catch (error) {
    console.error('Error updating psychologist profile:', error)
    return { success: false, error: 'Error interno del servidor' }
  }
}

// Obtener configuración de facturación
export async function getBillingSettings(): Promise<BillingSettings | null> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return null
    }

    const supabase = createSupabaseClient()
    
    // Primero obtener el ID del psicólogo
    const { data: psychologist } = await supabase
      .from('psychologists')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!psychologist) {
      return null
    }

    const { data: billing, error } = await supabase
      .from('billing_settings')
      .select('*')
      .eq('psychologist_id', psychologist.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching billing settings:', error)
      return null
    }

    return billing || {
      psychologist_id: psychologist.id,
      currency: 'EUR',
      tax_rate: 21
    }
  } catch (error) {
    console.error('Error getting billing settings:', error)
    return null
  }
}

// Actualizar configuración de facturación
export async function updateBillingSettings(billingData: Partial<BillingSettings>): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return { success: false, error: 'Usuario no autenticado' }
    }

    const supabase = createSupabaseClient()
    
    // Primero obtener el ID del psicólogo
    const { data: psychologist } = await supabase
      .from('psychologists')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!psychologist) {
      return { success: false, error: 'Perfil de psicólogo no encontrado' }
    }

    const { error } = await supabase
      .from('billing_settings')
      .upsert({
        psychologist_id: psychologist.id,
        ...billingData,
        updated_at: new Date().toISOString()
      }, { onConflict: 'psychologist_id' })

    if (error) {
      console.error('Error updating billing settings:', error)
      return { success: false, error: 'Error al actualizar la configuración de facturación' }
    }

    revalidatePath('/configuracion')
    return { success: true }
  } catch (error) {
    console.error('Error updating billing settings:', error)
    return { success: false, error: 'Error interno del servidor' }
  }
}

// Obtener configuración de notificaciones
export async function getNotificationSettings(): Promise<NotificationSettings | null> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return null
    }

    const supabase = createSupabaseClient()
    
    // Primero obtener el ID del psicólogo
    const { data: psychologist } = await supabase
      .from('psychologists')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!psychologist) {
      return null
    }

    const { data: notifications, error } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('psychologist_id', psychologist.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching notification settings:', error)
      return null
    }

    return notifications || {
      psychologist_id: psychologist.id,
      email_notifications: true,
      appointment_reminders: true,
      payment_reminders: true,
      weekly_reports: true,
      marketing_emails: false
    }
  } catch (error) {
    console.error('Error getting notification settings:', error)
    return null
  }
}

// Actualizar configuración de notificaciones
export async function updateNotificationSettings(notificationData: Partial<NotificationSettings>): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return { success: false, error: 'Usuario no autenticado' }
    }

    const supabase = createSupabaseClient()
    
    // Primero obtener el ID del psicólogo
    const { data: psychologist } = await supabase
      .from('psychologists')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!psychologist) {
      return { success: false, error: 'Perfil de psicólogo no encontrado' }
    }

    const { error } = await supabase
      .from('notification_settings')
      .upsert({
        psychologist_id: psychologist.id,
        ...notificationData,
        updated_at: new Date().toISOString()
      }, { onConflict: 'psychologist_id' })

    if (error) {
      console.error('Error updating notification settings:', error)
      return { success: false, error: 'Error al actualizar la configuración de notificaciones' }
    }

    revalidatePath('/configuracion')
    return { success: true }
  } catch (error) {
    console.error('Error updating notification settings:', error)
    return { success: false, error: 'Error interno del servidor' }
  }
}

// Eliminar cuenta del usuario
export async function deleteUserAccount(): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return { success: false, error: 'Usuario no autenticado' }
    }

    const supabase = createSupabaseClient()
    
    // Eliminar todos los datos del usuario
    const { error } = await supabase
      .from('psychologists')
      .delete()
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting user account:', error)
      return { success: false, error: 'Error al eliminar la cuenta' }
    }

    // Nota: La eliminación del usuario de Clerk debe hacerse desde el frontend
    return { success: true }
  } catch (error) {
    console.error('Error deleting user account:', error)
    return { success: false, error: 'Error interno del servidor' }
  }
}

// Exportar datos del usuario
export async function exportUserData(): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return { success: false, error: 'Usuario no autenticado' }
    }

    const supabase = createSupabaseClient()
    
    // Obtener todos los datos del usuario
    const { data: psychologist } = await supabase
      .from('psychologists')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (!psychologist) {
      return { success: false, error: 'Perfil no encontrado' }
    }

    const { data: patients } = await supabase
      .from('patients')
      .select('*')
      .eq('psychologist_id', psychologist.id)

    const { data: appointments } = await supabase
      .from('appointments')
      .select('*')
      .eq('psychologist_id', psychologist.id)

    const { data: notes } = await supabase
      .from('clinical_notes')
      .select('*')
      .eq('psychologist_id', psychologist.id)

    const { data: invoices } = await supabase
      .from('invoices')
      .select('*')
      .eq('psychologist_id', psychologist.id)

    const exportData = {
      psychologist,
      patients: patients || [],
      appointments: appointments || [],
      notes: notes || [],
      invoices: invoices || [],
      exported_at: new Date().toISOString()
    }

    return { success: true, data: exportData }
  } catch (error) {
    console.error('Error exporting user data:', error)
    return { success: false, error: 'Error interno del servidor' }
  }
}

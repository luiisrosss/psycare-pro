'use server'

import { createClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export interface Reminder {
  id: string
  psychologist_id: string
  patient_id: string
  type: 'appointment' | 'payment' | 'follow_up'
  title: string
  description: string
  scheduled_date: string
  status: 'active' | 'sent' | 'cancelled'
  delivery_method: 'email' | 'sms'
  sent: boolean
  created_at: string
  updated_at: string
  patient?: {
    id: string
    first_name: string
    last_name: string
    email?: string
    phone?: string
  }
}

export interface CreateReminderData {
  patient_id: string
  type: 'appointment' | 'payment' | 'follow_up'
  title: string
  description: string
  scheduled_date: string
  delivery_method: 'email' | 'sms'
}

export interface UpdateReminderData {
  patient_id?: string
  type?: string
  title?: string
  description?: string
  scheduled_date?: string
  status?: string
  delivery_method?: string
}

export async function createReminder(data: CreateReminderData): Promise<{ success: boolean; data?: Reminder; error?: string }> {
  try {
    const supabase = createClient()
    
    // Obtener el usuario autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'No autorizado' }
    }

    // Obtener el psicólogo asociado al usuario
    const { data: psychologist, error: psychError } = await supabase
      .from('psychologists')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (psychError || !psychologist) {
      return { success: false, error: 'Psicólogo no encontrado' }
    }

    const { data: reminder, error } = await supabase
      .from('reminders')
      .insert({
        psychologist_id: psychologist.id,
        patient_id: data.patient_id,
        type: data.type,
        title: data.title,
        description: data.description,
        scheduled_date: data.scheduled_date,
        status: 'active',
        delivery_method: data.delivery_method,
        sent: false
      })
      .select(`
        *,
        patient:patients(id, first_name, last_name, email, phone)
      `)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/recordatorios')
    return { success: true, data: reminder }
  } catch (error) {
    return { success: false, error: 'Error interno del servidor' }
  }
}

export async function getAllReminders(): Promise<{ success: boolean; data?: Reminder[]; error?: string }> {
  try {
    const supabase = createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'No autorizado' }
    }

    const { data: psychologist, error: psychError } = await supabase
      .from('psychologists')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (psychError || !psychologist) {
      return { success: false, error: 'Psicólogo no encontrado' }
    }

    const { data: reminders, error } = await supabase
      .from('reminders')
      .select(`
        *,
        patient:patients(id, first_name, last_name, email, phone)
      `)
      .eq('psychologist_id', psychologist.id)
      .order('scheduled_date', { ascending: true })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: reminders || [] }
  } catch (error) {
    return { success: false, error: 'Error interno del servidor' }
  }
}

export async function getReminder(id: string): Promise<{ success: boolean; data?: Reminder; error?: string }> {
  try {
    const supabase = createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'No autorizado' }
    }

    const { data: psychologist, error: psychError } = await supabase
      .from('psychologists')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (psychError || !psychologist) {
      return { success: false, error: 'Psicólogo no encontrado' }
    }

    const { data: reminder, error } = await supabase
      .from('reminders')
      .select(`
        *,
        patient:patients(id, first_name, last_name, email, phone)
      `)
      .eq('id', id)
      .eq('psychologist_id', psychologist.id)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: reminder }
  } catch (error) {
    return { success: false, error: 'Error interno del servidor' }
  }
}

export async function updateReminder(id: string, data: UpdateReminderData): Promise<{ success: boolean; data?: Reminder; error?: string }> {
  try {
    const supabase = createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'No autorizado' }
    }

    const { data: psychologist, error: psychError } = await supabase
      .from('psychologists')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (psychError || !psychologist) {
      return { success: false, error: 'Psicólogo no encontrado' }
    }

    const { data: reminder, error } = await supabase
      .from('reminders')
      .update(data)
      .eq('id', id)
      .eq('psychologist_id', psychologist.id)
      .select(`
        *,
        patient:patients(id, first_name, last_name, email, phone)
      `)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/recordatorios')
    return { success: true, data: reminder }
  } catch (error) {
    return { success: false, error: 'Error interno del servidor' }
  }
}

export async function deleteReminder(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'No autorizado' }
    }

    const { data: psychologist, error: psychError } = await supabase
      .from('psychologists')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (psychError || !psychologist) {
      return { success: false, error: 'Psicólogo no encontrado' }
    }

    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', id)
      .eq('psychologist_id', psychologist.id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/recordatorios')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error interno del servidor' }
  }
}

export async function sendReminder(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'No autorizado' }
    }

    const { data: psychologist, error: psychError } = await supabase
      .from('psychologists')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (psychError || !psychologist) {
      return { success: false, error: 'Psicólogo no encontrado' }
    }

    // Obtener el recordatorio
    const { data: reminder, error: reminderError } = await supabase
      .from('reminders')
      .select(`
        *,
        patient:patients(id, first_name, last_name, email, phone)
      `)
      .eq('id', id)
      .eq('psychologist_id', psychologist.id)
      .single()

    if (reminderError || !reminder) {
      return { success: false, error: 'Recordatorio no encontrado' }
    }

    // Aquí se implementaría la lógica de envío real
    // Por ahora, solo marcamos como enviado
    const { error: updateError } = await supabase
      .from('reminders')
      .update({ 
        status: 'sent',
        sent: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('psychologist_id', psychologist.id)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    revalidatePath('/recordatorios')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error interno del servidor' }
  }
}

export async function getReminderStats(): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const supabase = createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'No autorizado' }
    }

    const { data: psychologist, error: psychError } = await supabase
      .from('psychologists')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (psychError || !psychologist) {
      return { success: false, error: 'Psicólogo no encontrado' }
    }

    const { data: reminders, error } = await supabase
      .from('reminders')
      .select('status, sent')
      .eq('psychologist_id', psychologist.id)

    if (error) {
      return { success: false, error: error.message }
    }

    const stats = {
      totalActive: reminders?.filter(r => r.status === 'active').length || 0,
      totalSent: reminders?.filter(r => r.status === 'sent').length || 0,
      totalPending: reminders?.filter(r => !r.sent).length || 0,
      totalReminders: reminders?.length || 0
    }

    return { success: true, data: stats }
  } catch (error) {
    return { success: false, error: 'Error interno del servidor' }
  }
}

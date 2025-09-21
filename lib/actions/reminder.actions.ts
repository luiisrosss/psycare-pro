'use server'

import { createSupabaseClient } from '@/lib/supabase'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export interface Recordatorio {
  id: string
  psychologist_id: string
  patient_id: string
  appointment_id?: string
  reminder_type: 'appointment' | 'payment' | 'note' | 'follow_up' | 'custom'
  title: string
  message: string
  reminder_date: string
  is_sent: boolean
  sent_at?: string
  created_at: string
  updated_at: string
  patients?: {
    first_name: string
    last_name: string
    email?: string
    phone?: string
  }
  appointments?: {
    appointment_date: string
    session_type: string
  }
}

export interface CrearRecordatorioData {
  patient_id: string
  appointment_id?: string
  reminder_type: 'appointment' | 'payment' | 'note' | 'follow_up' | 'custom'
  title: string
  message: string
  reminder_date: string
}

export interface ActualizarRecordatorioData {
  title?: string
  message?: string
  reminder_date?: string
  is_sent?: boolean
}

// Obtener todos los recordatorios del psicólogo
export async function obtenerRecordatorios(): Promise<Recordatorio[]> {
  try {
    const { userId } = await auth()
    if (!userId) {
      throw new Error('Usuario no autenticado')
    }

    const supabase = createSupabaseClient()
    
    const { data: psychologist } = await supabase
      .from('psychologists')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!psychologist) {
      throw new Error('Psicólogo no encontrado')
    }

    const { data: recordatorios, error } = await supabase
      .from('reminders')
      .select(`
        *,
        patients!inner(first_name, last_name, email, phone),
        appointments(appointment_date, session_type)
      `)
      .eq('psychologist_id', psychologist.id)
      .order('reminder_date', { ascending: true })

    if (error) {
      throw new Error(`Error al obtener recordatorios: ${error.message}`)
    }

    return recordatorios || []
  } catch (error) {
    console.error('Error en obtenerRecordatorios:', error)
    throw error
  }
}

// Obtener recordatorios pendientes
export async function obtenerRecordatoriosPendientes(): Promise<Recordatorio[]> {
  try {
    const { userId } = await auth()
    if (!userId) {
      throw new Error('Usuario no autenticado')
    }

    const supabase = createSupabaseClient()
    
    const { data: psychologist } = await supabase
      .from('psychologists')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!psychologist) {
      throw new Error('Psicólogo no encontrado')
    }

    const ahora = new Date().toISOString()

    const { data: recordatorios, error } = await supabase
      .from('reminders')
      .select(`
        *,
        patients!inner(first_name, last_name, email, phone),
        appointments(appointment_date, session_type)
      `)
      .eq('psychologist_id', psychologist.id)
      .eq('is_sent', false)
      .lte('reminder_date', ahora)
      .order('reminder_date', { ascending: true })

    if (error) {
      throw new Error(`Error al obtener recordatorios pendientes: ${error.message}`)
    }

    return recordatorios || []
  } catch (error) {
    console.error('Error en obtenerRecordatoriosPendientes:', error)
    throw error
  }
}

// Crear nuevo recordatorio
export async function crearRecordatorio(datos: CrearRecordatorioData): Promise<Recordatorio> {
  try {
    const { userId } = await auth()
    if (!userId) {
      throw new Error('Usuario no autenticado')
    }

    const supabase = createSupabaseClient()
    
    const { data: psychologist } = await supabase
      .from('psychologists')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!psychologist) {
      throw new Error('Psicólogo no encontrado')
    }

    const { data: nuevoRecordatorio, error } = await supabase
      .from('reminders')
      .insert({
        psychologist_id: psychologist.id,
        patient_id: datos.patient_id,
        appointment_id: datos.appointment_id,
        reminder_type: datos.reminder_type,
        title: datos.title,
        message: datos.message,
        reminder_date: datos.reminder_date,
        is_sent: false
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Error al crear recordatorio: ${error.message}`)
    }

    revalidatePath('/recordatorios')
    return nuevoRecordatorio
  } catch (error) {
    console.error('Error en crearRecordatorio:', error)
    throw error
  }
}

// Actualizar recordatorio
export async function actualizarRecordatorio(recordatorioId: string, datos: ActualizarRecordatorioData): Promise<Recordatorio> {
  try {
    const { userId } = await auth()
    if (!userId) {
      throw new Error('Usuario no autenticado')
    }

    const supabase = createSupabaseClient()
    
    const { data: psychologist } = await supabase
      .from('psychologists')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!psychologist) {
      throw new Error('Psicólogo no encontrado')
    }

    const updateData = {
      ...datos,
      updated_at: new Date().toISOString()
    }

    // Si se marca como enviado, agregar timestamp
    if (datos.is_sent && !datos.is_sent) {
      updateData.sent_at = new Date().toISOString()
    }

    const { data: recordatorioActualizado, error } = await supabase
      .from('reminders')
      .update(updateData)
      .eq('id', recordatorioId)
      .eq('psychologist_id', psychologist.id)
      .select()
      .single()

    if (error) {
      throw new Error(`Error al actualizar recordatorio: ${error.message}`)
    }

    revalidatePath('/recordatorios')
    return recordatorioActualizado
  } catch (error) {
    console.error('Error en actualizarRecordatorio:', error)
    throw error
  }
}

// Eliminar recordatorio
export async function eliminarRecordatorio(recordatorioId: string): Promise<void> {
  try {
    const { userId } = await auth()
    if (!userId) {
      throw new Error('Usuario no autenticado')
    }

    const supabase = createSupabaseClient()
    
    const { data: psychologist } = await supabase
      .from('psychologists')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!psychologist) {
      throw new Error('Psicólogo no encontrado')
    }

    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', recordatorioId)
      .eq('psychologist_id', psychologist.id)

    if (error) {
      throw new Error(`Error al eliminar recordatorio: ${error.message}`)
    }

    revalidatePath('/recordatorios')
  } catch (error) {
    console.error('Error en eliminarRecordatorio:', error)
    throw error
  }
}

// Marcar recordatorio como enviado
export async function marcarRecordatorioComoEnviado(recordatorioId: string): Promise<Recordatorio> {
  try {
    const { userId } = await auth()
    if (!userId) {
      throw new Error('Usuario no autenticado')
    }

    const supabase = createSupabaseClient()
    
    const { data: psychologist } = await supabase
      .from('psychologists')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!psychologist) {
      throw new Error('Psicólogo no encontrado')
    }

    const { data: recordatorioActualizado, error } = await supabase
      .from('reminders')
      .update({
        is_sent: true,
        sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', recordatorioId)
      .eq('psychologist_id', psychologist.id)
      .select()
      .single()

    if (error) {
      throw new Error(`Error al marcar recordatorio como enviado: ${error.message}`)
    }

    revalidatePath('/recordatorios')
    return recordatorioActualizado
  } catch (error) {
    console.error('Error en marcarRecordatorioComoEnviado:', error)
    throw error
  }
}

// Crear recordatorio automático para cita
export async function crearRecordatorioParaCita(appointmentId: string, horasAntes: number = 24): Promise<Recordatorio> {
  try {
    const { userId } = await auth()
    if (!userId) {
      throw new Error('Usuario no autenticado')
    }

    const supabase = createSupabaseClient()
    
    const { data: psychologist } = await supabase
      .from('psychologists')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!psychologist) {
      throw new Error('Psicólogo no encontrado')
    }

    // Obtener información de la cita
    const { data: appointment } = await supabase
      .from('appointments')
      .select(`
        patient_id,
        appointment_date,
        session_type,
        patients!inner(first_name, last_name)
      `)
      .eq('id', appointmentId)
      .eq('psychologist_id', psychologist.id)
      .single()

    if (!appointment) {
      throw new Error('Cita no encontrada')
    }

    // Calcular fecha del recordatorio
    const fechaCita = new Date(appointment.appointment_date)
    const fechaRecordatorio = new Date(fechaCita)
    fechaRecordatorio.setHours(fechaRecordatorio.getHours() - horasAntes)

    const { data: nuevoRecordatorio, error } = await supabase
      .from('reminders')
      .insert({
        psychologist_id: psychologist.id,
        patient_id: appointment.patient_id,
        appointment_id: appointmentId,
        reminder_type: 'appointment',
        title: `Recordatorio de cita - ${appointment.patients.first_name} ${appointment.patients.last_name}`,
        message: `Tienes una cita programada para ${fechaCita.toLocaleDateString('es-ES')} a las ${fechaCita.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}. Tipo de sesión: ${appointment.session_type}`,
        reminder_date: fechaRecordatorio.toISOString(),
        is_sent: false
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Error al crear recordatorio automático: ${error.message}`)
    }

    revalidatePath('/recordatorios')
    return nuevoRecordatorio
  } catch (error) {
    console.error('Error en crearRecordatorioParaCita:', error)
    throw error
  }
}

// Crear recordatorio automático para pago pendiente
export async function crearRecordatorioParaPago(invoiceId: string): Promise<Recordatorio> {
  try {
    const { userId } = await auth()
    if (!userId) {
      throw new Error('Usuario no autenticado')
    }

    const supabase = createSupabaseClient()
    
    const { data: psychologist } = await supabase
      .from('psychologists')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!psychologist) {
      throw new Error('Psicólogo no encontrado')
    }

    // Obtener información de la factura
    const { data: invoice } = await supabase
      .from('invoices')
      .select(`
        patient_id,
        invoice_number,
        total_amount,
        due_date,
        patients!inner(first_name, last_name)
      `)
      .eq('id', invoiceId)
      .eq('psychologist_id', psychologist.id)
      .single()

    if (!invoice) {
      throw new Error('Factura no encontrada')
    }

    // Calcular fecha del recordatorio (3 días antes del vencimiento)
    const fechaVencimiento = new Date(invoice.due_date)
    const fechaRecordatorio = new Date(fechaVencimiento)
    fechaRecordatorio.setDate(fechaRecordatorio.getDate() - 3)

    const { data: nuevoRecordatorio, error } = await supabase
      .from('reminders')
      .insert({
        psychologist_id: psychologist.id,
        patient_id: invoice.patient_id,
        reminder_type: 'payment',
        title: `Recordatorio de pago - ${invoice.patients.first_name} ${invoice.patients.last_name}`,
        message: `La factura ${invoice.invoice_number} por ${invoice.total_amount}€ vence el ${fechaVencimiento.toLocaleDateString('es-ES')}. Recuerda contactar al paciente para el pago.`,
        reminder_date: fechaRecordatorio.toISOString(),
        is_sent: false
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Error al crear recordatorio de pago: ${error.message}`)
    }

    revalidatePath('/recordatorios')
    return nuevoRecordatorio
  } catch (error) {
    console.error('Error en crearRecordatorioParaPago:', error)
    throw error
  }
}

// Obtener estadísticas de recordatorios
export async function obtenerEstadisticasRecordatorios() {
  try {
    const { userId } = await auth()
    if (!userId) {
      throw new Error('Usuario no autenticado')
    }

    const supabase = createSupabaseClient()
    
    const { data: psychologist } = await supabase
      .from('psychologists')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!psychologist) {
      throw new Error('Psicólogo no encontrado')
    }

    // Total de recordatorios
    const { count: totalRecordatorios } = await supabase
      .from('reminders')
      .select('*', { count: 'exact', head: true })
      .eq('psychologist_id', psychologist.id)

    // Recordatorios enviados
    const { count: recordatoriosEnviados } = await supabase
      .from('reminders')
      .select('*', { count: 'exact', head: true })
      .eq('psychologist_id', psychologist.id)
      .eq('is_sent', true)

    // Recordatorios pendientes
    const ahora = new Date().toISOString()
    const { count: recordatoriosPendientes } = await supabase
      .from('reminders')
      .select('*', { count: 'exact', head: true })
      .eq('psychologist_id', psychologist.id)
      .eq('is_sent', false)
      .lte('reminder_date', ahora)

    // Recordatorios de hoy
    const inicioDia = new Date()
    inicioDia.setHours(0, 0, 0, 0)
    const finDia = new Date()
    finDia.setHours(23, 59, 59, 999)

    const { count: recordatoriosHoy } = await supabase
      .from('reminders')
      .select('*', { count: 'exact', head: true })
      .eq('psychologist_id', psychologist.id)
      .gte('reminder_date', inicioDia.toISOString())
      .lte('reminder_date', finDia.toISOString())

    return {
      totalRecordatorios: totalRecordatorios || 0,
      recordatoriosEnviados: recordatoriosEnviados || 0,
      recordatoriosPendientes: recordatoriosPendientes || 0,
      recordatoriosHoy: recordatoriosHoy || 0
    }
  } catch (error) {
    console.error('Error en obtenerEstadisticasRecordatorios:', error)
    throw error
  }
}
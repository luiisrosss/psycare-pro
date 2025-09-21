'use server'

import { createSupabaseClient } from '@/lib/supabase'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export interface Factura {
  id: string
  psychologist_id: string
  patient_id: string
  invoice_number: string
  invoice_date: string
  due_date?: string
  amount: number
  tax_rate: number
  total_amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  notes?: string
  created_at: string
  updated_at: string
  patients?: {
    first_name: string
    last_name: string
    email?: string
  }
}

export interface CrearFacturaData {
  patient_id: string
  invoice_date: string
  due_date?: string
  amount: number
  tax_rate?: number
  notes?: string
}

export interface ActualizarFacturaData {
  invoice_date?: string
  due_date?: string
  amount?: number
  tax_rate?: number
  total_amount?: number
  status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  notes?: string
}

// Obtener todas las facturas del psicólogo
export async function obtenerFacturas(): Promise<Factura[]> {
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

    const { data: facturas, error } = await supabase
      .from('invoices')
      .select(`
        *,
        patients!inner(first_name, last_name, email)
      `)
      .eq('psychologist_id', psychologist.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Error al obtener facturas: ${error.message}`)
    }

    return facturas || []
  } catch (error) {
    console.error('Error en obtenerFacturas:', error)
    throw error
  }
}

// Obtener facturas por paciente
export async function obtenerFacturasPorPaciente(patientId: string): Promise<Factura[]> {
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

    const { data: facturas, error } = await supabase
      .from('invoices')
      .select(`
        *,
        patients!inner(first_name, last_name, email)
      `)
      .eq('psychologist_id', psychologist.id)
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Error al obtener facturas del paciente: ${error.message}`)
    }

    return facturas || []
  } catch (error) {
    console.error('Error en obtenerFacturasPorPaciente:', error)
    throw error
  }
}

// Crear nueva factura
export async function crearFactura(datos: CrearFacturaData): Promise<Factura> {
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

    const taxRate = datos.tax_rate || 0
    const totalAmount = datos.amount + (datos.amount * taxRate / 100)

    const { data: nuevaFactura, error } = await supabase
      .from('invoices')
      .insert({
        psychologist_id: psychologist.id,
        patient_id: datos.patient_id,
        invoice_date: datos.invoice_date,
        due_date: datos.due_date,
        amount: datos.amount,
        tax_rate: taxRate,
        total_amount: totalAmount,
        status: 'draft',
        notes: datos.notes
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Error al crear factura: ${error.message}`)
    }

    revalidatePath('/facturacion')
    return nuevaFactura
  } catch (error) {
    console.error('Error en crearFactura:', error)
    throw error
  }
}

// Actualizar factura
export async function actualizarFactura(facturaId: string, datos: ActualizarFacturaData): Promise<Factura> {
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

    // Recalcular total si se actualiza amount o tax_rate
    let updateData = { ...datos }
    if (datos.amount !== undefined || datos.tax_rate !== undefined) {
      const { data: facturaActual } = await supabase
        .from('invoices')
        .select('amount, tax_rate')
        .eq('id', facturaId)
        .eq('psychologist_id', psychologist.id)
        .single()

      if (facturaActual) {
        const amount = datos.amount ?? facturaActual.amount
        const taxRate = datos.tax_rate ?? facturaActual.tax_rate
        updateData.total_amount = amount + (amount * taxRate / 100)
      }
    }

    const { data: facturaActualizada, error } = await supabase
      .from('invoices')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', facturaId)
      .eq('psychologist_id', psychologist.id)
      .select()
      .single()

    if (error) {
      throw new Error(`Error al actualizar factura: ${error.message}`)
    }

    revalidatePath('/facturacion')
    return facturaActualizada
  } catch (error) {
    console.error('Error en actualizarFactura:', error)
    throw error
  }
}

// Eliminar factura
export async function eliminarFactura(facturaId: string): Promise<void> {
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
      .from('invoices')
      .delete()
      .eq('id', facturaId)
      .eq('psychologist_id', psychologist.id)

    if (error) {
      throw new Error(`Error al eliminar factura: ${error.message}`)
    }

    revalidatePath('/facturacion')
  } catch (error) {
    console.error('Error en eliminarFactura:', error)
    throw error
  }
}

// Marcar factura como pagada
export async function marcarFacturaComoPagada(facturaId: string): Promise<Factura> {
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

    const { data: facturaActualizada, error } = await supabase
      .from('invoices')
      .update({
        status: 'paid',
        updated_at: new Date().toISOString()
      })
      .eq('id', facturaId)
      .eq('psychologist_id', psychologist.id)
      .select()
      .single()

    if (error) {
      throw new Error(`Error al marcar factura como pagada: ${error.message}`)
    }

    revalidatePath('/facturacion')
    return facturaActualizada
  } catch (error) {
    console.error('Error en marcarFacturaComoPagada:', error)
    throw error
  }
}

// Obtener estadísticas de facturación
export async function obtenerEstadisticasFacturacion() {
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

    // Total de facturas
    const { count: totalFacturas } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('psychologist_id', psychologist.id)

    // Facturas pagadas
    const { count: facturasPagadas } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('psychologist_id', psychologist.id)
      .eq('status', 'paid')

    // Facturas pendientes
    const { count: facturasPendientes } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('psychologist_id', psychologist.id)
      .in('status', ['draft', 'sent', 'overdue'])

    // Ingresos totales
    const { data: facturasPagadasData } = await supabase
      .from('invoices')
      .select('total_amount')
      .eq('psychologist_id', psychologist.id)
      .eq('status', 'paid')

    const ingresosTotales = facturasPagadasData?.reduce((sum, factura) => sum + factura.total_amount, 0) || 0

    // Ingresos del mes actual
    const inicioMes = new Date()
    inicioMes.setDate(1)
    inicioMes.setHours(0, 0, 0, 0)

    const { data: facturasMesActual } = await supabase
      .from('invoices')
      .select('total_amount')
      .eq('psychologist_id', psychologist.id)
      .eq('status', 'paid')
      .gte('updated_at', inicioMes.toISOString())

    const ingresosMesActual = facturasMesActual?.reduce((sum, factura) => sum + factura.total_amount, 0) || 0

    return {
      totalFacturas: totalFacturas || 0,
      facturasPagadas: facturasPagadas || 0,
      facturasPendientes: facturasPendientes || 0,
      ingresosTotales,
      ingresosMesActual
    }
  } catch (error) {
    console.error('Error en obtenerEstadisticasFacturacion:', error)
    throw error
  }
}

// Generar factura automática desde cita completada
export async function generarFacturaDesdeCita(appointmentId: string, amount: number): Promise<Factura> {
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
        patients!inner(first_name, last_name)
      `)
      .eq('id', appointmentId)
      .eq('psychologist_id', psychologist.id)
      .single()

    if (!appointment) {
      throw new Error('Cita no encontrada')
    }

    // Crear factura automática
    const { data: nuevaFactura, error } = await supabase
      .from('invoices')
      .insert({
        psychologist_id: psychologist.id,
        patient_id: appointment.patient_id,
        invoice_date: new Date().toISOString().split('T')[0],
        amount: amount,
        tax_rate: 0, // Por defecto sin impuestos
        total_amount: amount,
        status: 'draft',
        notes: `Factura automática generada desde cita del ${new Date(appointment.appointment_date).toLocaleDateString('es-ES')}`
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Error al generar factura automática: ${error.message}`)
    }

    revalidatePath('/facturacion')
    return nuevaFactura
  } catch (error) {
    console.error('Error en generarFacturaDesdeCita:', error)
    throw error
  }
}
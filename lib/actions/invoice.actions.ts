'use server'

import { createClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export interface Invoice {
  id: string
  psychologist_id: string
  patient_id: string
  invoice_number: string
  date: string
  due_date: string
  concept: string
  quantity: number
  unit_price: number
  total_amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  payment_method?: string
  notes?: string
  created_at: string
  updated_at: string
  patient?: {
    id: string
    first_name: string
    last_name: string
    email?: string
  }
}

export interface CreateInvoiceData {
  patient_id: string
  date: string
  due_date: string
  concept: string
  quantity: number
  unit_price: number
  payment_method?: string
  notes?: string
}

export interface UpdateInvoiceData {
  patient_id?: string
  date?: string
  due_date?: string
  concept?: string
  quantity?: number
  unit_price?: number
  status?: string
  payment_method?: string
  notes?: string
}

export async function createInvoice(data: CreateInvoiceData): Promise<{ success: boolean; data?: Invoice; error?: string }> {
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

    // Generar número de factura
    const { data: lastInvoice } = await supabase
      .from('invoices')
      .select('invoice_number')
      .eq('psychologist_id', psychologist.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    const invoiceNumber = lastInvoice 
      ? `FAC-${new Date().getFullYear()}-${String(parseInt(lastInvoice.invoice_number.split('-')[2]) + 1).padStart(3, '0')}`
      : `FAC-${new Date().getFullYear()}-001`

    const totalAmount = data.quantity * data.unit_price

    const { data: invoice, error } = await supabase
      .from('invoices')
      .insert({
        psychologist_id: psychologist.id,
        patient_id: data.patient_id,
        invoice_number: invoiceNumber,
        date: data.date,
        due_date: data.due_date,
        concept: data.concept,
        quantity: data.quantity,
        unit_price: data.unit_price,
        total_amount: totalAmount,
        status: 'draft',
        payment_method: data.payment_method,
        notes: data.notes
      })
      .select(`
        *,
        patient:patients(id, first_name, last_name, email)
      `)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/facturacion')
    return { success: true, data: invoice }
  } catch (error) {
    return { success: false, error: 'Error interno del servidor' }
  }
}

export async function getAllInvoices(): Promise<{ success: boolean; data?: Invoice[]; error?: string }> {
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

    const { data: invoices, error } = await supabase
      .from('invoices')
      .select(`
        *,
        patient:patients(id, first_name, last_name, email)
      `)
      .eq('psychologist_id', psychologist.id)
      .order('created_at', { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: invoices || [] }
  } catch (error) {
    return { success: false, error: 'Error interno del servidor' }
  }
}

export async function getInvoice(id: string): Promise<{ success: boolean; data?: Invoice; error?: string }> {
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

    const { data: invoice, error } = await supabase
      .from('invoices')
      .select(`
        *,
        patient:patients(id, first_name, last_name, email)
      `)
      .eq('id', id)
      .eq('psychologist_id', psychologist.id)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: invoice }
  } catch (error) {
    return { success: false, error: 'Error interno del servidor' }
  }
}

export async function updateInvoice(id: string, data: UpdateInvoiceData): Promise<{ success: boolean; data?: Invoice; error?: string }> {
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

    const updateData: any = { ...data }
    
    // Recalcular total si se actualizan cantidad o precio
    if (data.quantity !== undefined || data.unit_price !== undefined) {
      const { data: currentInvoice } = await supabase
        .from('invoices')
        .select('quantity, unit_price')
        .eq('id', id)
        .eq('psychologist_id', psychologist.id)
        .single()

      if (currentInvoice) {
        const quantity = data.quantity ?? currentInvoice.quantity
        const unitPrice = data.unit_price ?? currentInvoice.unit_price
        updateData.total_amount = quantity * unitPrice
      }
    }

    const { data: invoice, error } = await supabase
      .from('invoices')
      .update(updateData)
      .eq('id', id)
      .eq('psychologist_id', psychologist.id)
      .select(`
        *,
        patient:patients(id, first_name, last_name, email)
      `)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/facturacion')
    return { success: true, data: invoice }
  } catch (error) {
    return { success: false, error: 'Error interno del servidor' }
  }
}

export async function deleteInvoice(id: string): Promise<{ success: boolean; error?: string }> {
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
      .from('invoices')
      .delete()
      .eq('id', id)
      .eq('psychologist_id', psychologist.id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/facturacion')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error interno del servidor' }
  }
}

export async function updateInvoiceStatus(id: string, status: string): Promise<{ success: boolean; data?: Invoice; error?: string }> {
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

    const { data: invoice, error } = await supabase
      .from('invoices')
      .update({ status })
      .eq('id', id)
      .eq('psychologist_id', psychologist.id)
      .select(`
        *,
        patient:patients(id, first_name, last_name, email)
      `)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/facturacion')
    return { success: true, data: invoice }
  } catch (error) {
    return { success: false, error: 'Error interno del servidor' }
  }
}

export async function getInvoiceStats(): Promise<{ success: boolean; data?: any; error?: string }> {
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

    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('total_amount, status')
      .eq('psychologist_id', psychologist.id)

    if (error) {
      return { success: false, error: error.message }
    }

    const stats = {
      totalInvoiced: invoices?.reduce((sum, inv) => sum + inv.total_amount, 0) || 0,
      totalPaid: invoices?.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total_amount, 0) || 0,
      totalPending: invoices?.filter(inv => inv.status === 'sent' || inv.status === 'draft').reduce((sum, inv) => sum + inv.total_amount, 0) || 0,
      totalOverdue: invoices?.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.total_amount, 0) || 0,
      totalInvoices: invoices?.length || 0
    }

    return { success: true, data: stats }
  } catch (error) {
    return { success: false, error: 'Error interno del servidor' }
  }
}

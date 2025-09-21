'use server'

import { createSupabaseClient } from '@/lib/supabase'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export interface NotaClinica {
  id: string
  psychologist_id: string
  patient_id: string
  appointment_id?: string
  note_type: 'session' | 'assessment' | 'treatment_plan' | 'progress' | 'other'
  title: string
  content: string
  ai_summary?: string
  tags: string[]
  is_confidential: boolean
  created_at: string
  updated_at: string
}

export interface CrearNotaData {
  patient_id: string
  appointment_id?: string
  note_type: 'session' | 'assessment' | 'treatment_plan' | 'progress' | 'other'
  title: string
  content: string
  ai_summary?: string
  tags?: string[]
  is_confidential?: boolean
}

export interface ActualizarNotaData {
  title?: string
  content?: string
  ai_summary?: string
  tags?: string[]
  is_confidential?: boolean
}

// Obtener todas las notas del psicólogo
export async function obtenerNotas(): Promise<NotaClinica[]> {
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

    const { data: notas, error } = await supabase
      .from('clinical_notes')
      .select(`
        *,
        patients!inner(first_name, last_name),
        appointments(appointment_date, duration_minutes, session_type)
      `)
      .eq('psychologist_id', psychologist.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Error al obtener notas: ${error.message}`)
    }

    return notas || []
  } catch (error) {
    console.error('Error en obtenerNotas:', error)
    throw error
  }
}

// Obtener notas por paciente
export async function obtenerNotasPorPaciente(patientId: string): Promise<NotaClinica[]> {
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

    const { data: notas, error } = await supabase
      .from('clinical_notes')
      .select(`
        *,
        patients!inner(first_name, last_name),
        appointments(appointment_date, duration_minutes, session_type)
      `)
      .eq('psychologist_id', psychologist.id)
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Error al obtener notas del paciente: ${error.message}`)
    }

    return notas || []
  } catch (error) {
    console.error('Error en obtenerNotasPorPaciente:', error)
    throw error
  }
}

// Crear nueva nota
export async function crearNota(datos: CrearNotaData): Promise<NotaClinica> {
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

    const { data: nuevaNota, error } = await supabase
      .from('clinical_notes')
      .insert({
        psychologist_id: psychologist.id,
        patient_id: datos.patient_id,
        appointment_id: datos.appointment_id,
        note_type: datos.note_type,
        title: datos.title,
        content: datos.content,
        ai_summary: datos.ai_summary,
        tags: datos.tags || [],
        is_confidential: datos.is_confidential ?? true
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Error al crear nota: ${error.message}`)
    }

    revalidatePath('/notas')
    return nuevaNota
  } catch (error) {
    console.error('Error en crearNota:', error)
    throw error
  }
}

// Actualizar nota
export async function actualizarNota(notaId: string, datos: ActualizarNotaData): Promise<NotaClinica> {
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

    const { data: notaActualizada, error } = await supabase
      .from('clinical_notes')
      .update({
        ...datos,
        updated_at: new Date().toISOString()
      })
      .eq('id', notaId)
      .eq('psychologist_id', psychologist.id)
      .select()
      .single()

    if (error) {
      throw new Error(`Error al actualizar nota: ${error.message}`)
    }

    revalidatePath('/notas')
    return notaActualizada
  } catch (error) {
    console.error('Error en actualizarNota:', error)
    throw error
  }
}

// Eliminar nota
export async function eliminarNota(notaId: string): Promise<void> {
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
      .from('clinical_notes')
      .delete()
      .eq('id', notaId)
      .eq('psychologist_id', psychologist.id)

    if (error) {
      throw new Error(`Error al eliminar nota: ${error.message}`)
    }

    revalidatePath('/notas')
  } catch (error) {
    console.error('Error en eliminarNota:', error)
    throw error
  }
}

// Buscar notas
export async function buscarNotas(termino: string): Promise<NotaClinica[]> {
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

    const { data: notas, error } = await supabase
      .from('clinical_notes')
      .select(`
        *,
        patients!inner(first_name, last_name),
        appointments(appointment_date, duration_minutes, session_type)
      `)
      .eq('psychologist_id', psychologist.id)
      .or(`title.ilike.%${termino}%,content.ilike.%${termino}%,ai_summary.ilike.%${termino}%`)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Error al buscar notas: ${error.message}`)
    }

    return notas || []
  } catch (error) {
    console.error('Error en buscarNotas:', error)
    throw error
  }
}

// Obtener estadísticas de notas
export async function obtenerEstadisticasNotas() {
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

    // Total de notas
    const { count: totalNotas } = await supabase
      .from('clinical_notes')
      .select('*', { count: 'exact', head: true })
      .eq('psychologist_id', psychologist.id)

    // Notas de esta semana
    const inicioSemana = new Date()
    inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay())
    inicioSemana.setHours(0, 0, 0, 0)

    const { count: notasEstaSemana } = await supabase
      .from('clinical_notes')
      .select('*', { count: 'exact', head: true })
      .eq('psychologist_id', psychologist.id)
      .gte('created_at', inicioSemana.toISOString())

    // Notas por tipo
    const { data: notasPorTipo } = await supabase
      .from('clinical_notes')
      .select('note_type')
      .eq('psychologist_id', psychologist.id)

    const tiposCount = notasPorTipo?.reduce((acc: Record<string, number>, nota) => {
      acc[nota.note_type] = (acc[nota.note_type] || 0) + 1
      return acc
    }, {}) || {}

    return {
      totalNotas: totalNotas || 0,
      notasEstaSemana: notasEstaSemana || 0,
      tiposCount
    }
  } catch (error) {
    console.error('Error en obtenerEstadisticasNotas:', error)
    throw error
  }
}

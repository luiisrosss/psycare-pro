'use server'

import { createSupabaseClient } from '@/lib/supabase'
import { auth } from '@clerk/nextjs/server'

export interface DashboardMetrics {
  totalPatients: number
  activePatients: number
  appointmentsToday: number
  appointmentsThisWeek: number
  monthlyRevenue: number
  pendingNotes: number
  weeklyGrowth: number
  monthlyGrowth: number
  recentAppointments: Array<{
    id: string
    patient_name: string
    appointment_date: string
    session_type: string
    status: string
  }>
  recentNotes: Array<{
    id: string
    patient_name: string
    title: string
    created_at: string
    note_type: string
  }>
}

// Obtener métricas del dashboard
export async function obtenerMetricasDashboard(): Promise<DashboardMetrics> {
  try {
    const { userId } = await auth()
    if (!userId) {
      throw new Error('Usuario no autenticado')
    }

    const supabase = createSupabaseClient()
    
    // Buscar o crear psicólogo automáticamente
    let { data: psychologist } = await supabase
      .from('psychologists')
      .select('id')
      .eq('user_id', userId)
      .single()

    // Si no existe, crear automáticamente
    if (!psychologist) {
      const { data: newPsychologist } = await supabase
        .from('psychologists')
        .insert({
          user_id: userId,
          license_number: `TEMP-${userId.slice(-8)}`, // Temporal hasta que configure
        })
        .select('id')
        .single()

      if (!newPsychologist) {
        throw new Error('Error creando perfil de psicólogo')
      }

      psychologist = newPsychologist
    }

    // Total de pacientes
    const { count: totalPatients } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true })
      .eq('psychologist_id', psychologist.id)

    // Pacientes activos
    const { count: activePatients } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true })
      .eq('psychologist_id', psychologist.id)
      .eq('status', 'active')

    // Citas de hoy
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const finDia = new Date(hoy)
    finDia.setHours(23, 59, 59, 999)

    const { count: appointmentsToday } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('psychologist_id', psychologist.id)
      .gte('date', hoy.toISOString().split('T')[0])
      .lte('date', finDia.toISOString().split('T')[0])

    // Citas de esta semana
    const inicioSemana = new Date()
    inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay())
    inicioSemana.setHours(0, 0, 0, 0)
    
    const finSemana = new Date(inicioSemana)
    finSemana.setDate(finSemana.getDate() + 6)
    finSemana.setHours(23, 59, 59, 999)

    const { count: appointmentsThisWeek } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('psychologist_id', psychologist.id)
      .gte('date', inicioSemana.toISOString().split('T')[0])
      .lte('date', finSemana.toISOString().split('T')[0])

    // Ingresos del mes actual
    const inicioMes = new Date()
    inicioMes.setDate(1)
    inicioMes.setHours(0, 0, 0, 0)

    const { data: facturasMesActual } = await supabase
      .from('invoices')
      .select('amount')
      .eq('psychologist_id', psychologist.id)
      .eq('payment_status', 'paid')
      .gte('updated_at', inicioMes.toISOString())

    const monthlyRevenue = facturasMesActual?.reduce((sum, factura) => sum + factura.amount, 0) || 0

    // Notas pendientes (estimación simple - todas las citas completadas menos las que tienen notas)
    const { count: citasCompletadas } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('psychologist_id', psychologist.id)
      .eq('status', 'completed')

    const { count: notasExistentes } = await supabase
      .from('clinical_notes')
      .select('*', { count: 'exact', head: true })
      .eq('psychologist_id', psychologist.id)

    const pendingNotes = Math.max(0, (citasCompletadas || 0) - (notasExistentes || 0))

    // Crecimiento semanal (estimación)
    const semanaAnterior = new Date(inicioSemana)
    semanaAnterior.setDate(semanaAnterior.getDate() - 7)
    
    const { count: citasSemanaAnterior } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('psychologist_id', psychologist.id)
      .gte('appointment_date', semanaAnterior.toISOString())
      .lt('appointment_date', inicioSemana.toISOString())

    const weeklyGrowth = citasSemanaAnterior ? 
      Math.round(((appointmentsThisWeek - citasSemanaAnterior) / citasSemanaAnterior) * 100) : 0

    // Crecimiento mensual (estimación)
    const mesAnterior = new Date(inicioMes)
    mesAnterior.setMonth(mesAnterior.getMonth() - 1)

    const { data: facturasMesAnterior } = await supabase
      .from('invoices')
      .select('amount')
      .eq('psychologist_id', psychologist.id)
      .eq('payment_status', 'paid')
      .gte('updated_at', mesAnterior.toISOString())
      .lt('updated_at', inicioMes.toISOString())

    const ingresosMesAnterior = facturasMesAnterior?.reduce((sum, factura) => sum + factura.amount, 0) || 0
    const monthlyGrowth = ingresosMesAnterior ? 
      Math.round(((monthlyRevenue - ingresosMesAnterior) / ingresosMesAnterior) * 100) : 0

    // Citas recientes
    const { data: citasRecientes } = await supabase
      .from('appointments')
      .select(`
        id,
        date,
        session_type,
        status,
        patients!inner(first_name, last_name)
      `)
      .eq('psychologist_id', psychologist.id)
      .gte('date', hoy.toISOString().split('T')[0])
      .order('date', { ascending: true })
      .limit(5)

    const recentAppointments = citasRecientes?.map(cita => ({
      id: cita.id,
      patient_name: `${cita.patients.first_name} ${cita.patients.last_name}`,
      appointment_date: cita.date,
      session_type: cita.session_type,
      status: cita.status
    })) || []

    // Notas recientes
    const { data: notasRecientes } = await supabase
      .from('clinical_notes')
      .select(`
        id,
        content,
        created_at,
        patients!inner(first_name, last_name)
      `)
      .eq('psychologist_id', psychologist.id)
      .order('created_at', { ascending: false })
      .limit(5)

    const recentNotes = notasRecientes?.map(nota => ({
      id: nota.id,
      patient_name: `${nota.patients.first_name} ${nota.patients.last_name}`,
      title: nota.content.substring(0, 50) + '...', // Primera línea como título
      created_at: nota.created_at,
      note_type: 'session' // Tipo por defecto
    })) || []

    return {
      totalPatients: totalPatients || 0,
      activePatients: activePatients || 0,
      appointmentsToday: appointmentsToday || 0,
      appointmentsThisWeek: appointmentsThisWeek || 0,
      monthlyRevenue,
      pendingNotes,
      weeklyGrowth,
      monthlyGrowth,
      recentAppointments,
      recentNotes
    }
  } catch (error) {
    console.error('Error en obtenerMetricasDashboard:', error)
    // Retornar métricas por defecto en caso de error
    return {
      totalPatients: 0,
      activePatients: 0,
      appointmentsToday: 0,
      appointmentsThisWeek: 0,
      monthlyRevenue: 0,
      pendingNotes: 0,
      weeklyGrowth: 0,
      monthlyGrowth: 0,
      recentAppointments: [],
      recentNotes: []
    }
  }
}
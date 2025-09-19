'use server';

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";
import { DashboardMetrics } from "@/types";

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
    const { userId } = await auth();
    if (!userId) throw new Error('Usuario no autenticado');

    const supabase = createSupabaseClient();

    // Obtener el ID del psicólogo
    const { data: psychologist } = await supabase
        .from('psychologists')
        .select('id')
        .eq('user_id', userId)
        .single();

    if (!psychologist) throw new Error('Perfil de psicólogo no encontrado');

    const psychologistId = psychologist.id;

    // Obtener estadísticas de pacientes
    const { data: patients, error: patientsError } = await supabase
        .from('patients')
        .select('id, status')
        .eq('psychologist_id', psychologistId);

    if (patientsError) throw new Error(patientsError.message);

    const totalPatients = patients.length;
    const activePatients = patients.filter(p => p.status === 'active').length;

    // Obtener citas de hoy
    const today = new Date().toISOString().split('T')[0];
    const { data: appointmentsToday, error: appointmentsTodayError } = await supabase
        .from('appointments')
        .select('id')
        .eq('psychologist_id', psychologistId)
        .eq('date', today)
        .eq('status', 'scheduled');

    if (appointmentsTodayError) throw new Error(appointmentsTodayError.message);

    // Obtener citas de esta semana
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    const { data: appointmentsThisWeek, error: appointmentsWeekError } = await supabase
        .from('appointments')
        .select('id')
        .eq('psychologist_id', psychologistId)
        .gte('date', startOfWeek.toISOString().split('T')[0])
        .lte('date', endOfWeek.toISOString().split('T')[0])
        .eq('status', 'scheduled');

    if (appointmentsWeekError) throw new Error(appointmentsWeekError.message);

    // Obtener ingresos del mes actual
    const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
    const { data: monthlyRevenue, error: revenueError } = await supabase
        .from('appointments')
        .select('fee')
        .eq('psychologist_id', psychologistId)
        .eq('status', 'completed')
        .gte('date', `${currentMonth}-01`)
        .lt('date', `${currentMonth}-32`);

    if (revenueError) throw new Error(revenueError.message);

    const monthlyRevenueAmount = monthlyRevenue.reduce((sum, appointment) => sum + appointment.fee, 0);

    // Obtener notas pendientes (sin notas clínicas para citas completadas)
    const { data: completedAppointments, error: completedError } = await supabase
        .from('appointments')
        .select('id')
        .eq('psychologist_id', psychologistId)
        .eq('status', 'completed')
        .gte('date', today);

    if (completedError) throw new Error(completedError.message);

    const { data: clinicalNotes, error: notesError } = await supabase
        .from('clinical_notes')
        .select('appointment_id')
        .eq('psychologist_id', psychologistId)
        .in('appointment_id', completedAppointments.map(a => a.id));

    if (notesError) throw new Error(notesError.message);

    const pendingNotes = completedAppointments.length - clinicalNotes.length;

    // Obtener próximas citas
    const { data: upcomingAppointments, error: upcomingError } = await supabase
        .from('appointments')
        .select(`
            *,
            patient:patients(*)
        `)
        .eq('psychologist_id', psychologistId)
        .eq('status', 'scheduled')
        .gte('date', today)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true })
        .limit(5);

    if (upcomingError) throw new Error(upcomingError.message);

    return {
        total_patients: totalPatients,
        active_patients: activePatients,
        appointments_today: appointmentsToday.length,
        appointments_this_week: appointmentsThisWeek.length,
        monthly_revenue: monthlyRevenueAmount,
        pending_notes: pendingNotes,
        upcoming_appointments: upcomingAppointments || []
    };
};

export const getPsychologistProfile = async () => {
    const { userId } = await auth();
    if (!userId) throw new Error('Usuario no autenticado');

    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from('psychologists')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            // No existe el perfil, retornar null
            return null;
        }
        throw new Error(error.message);
    }

    return data;
};

export const createPsychologistProfile = async (formData: {
    license_number: string;
    specializations: string[];
    bio?: string;
    consultation_fee: number;
}) => {
    const { userId } = await auth();
    if (!userId) throw new Error('Usuario no autenticado');

    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from('psychologists')
        .insert({
            user_id: userId,
            ...formData
        })
        .select()
        .single();

    if (error) throw new Error(error.message);

    return data;
};

export const updatePsychologistProfile = async (formData: {
    license_number?: string;
    specializations?: string[];
    bio?: string;
    consultation_fee?: number;
    working_hours?: any;
}) => {
    const { userId } = await auth();
    if (!userId) throw new Error('Usuario no autenticado');

    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from('psychologists')
        .update(formData)
        .eq('user_id', userId)
        .select()
        .single();

    if (error) throw new Error(error.message);

    return data;
};

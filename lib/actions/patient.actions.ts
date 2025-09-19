'use server';

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { CreatePatient, Patient, PatientStatus } from "@/types";

export const createPatient = async (formData: CreatePatient) => {
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

    const { data, error } = await supabase
        .from('patients')
        .insert({
            ...formData,
            psychologist_id: psychologist.id
        })
        .select()
        .single();

    if (error) throw new Error(error.message);

    revalidatePath('/pacientes');
    return data;
};

export const getAllPatients = async ({ 
    limit = 10, 
    page = 1, 
    status, 
    search 
}: {
    limit?: number;
    page?: number;
    status?: PatientStatus;
    search?: string;
} = {}) => {
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

    let query = supabase
        .from('patients')
        .select('*')
        .eq('psychologist_id', psychologist.id);

    if (status) {
        query = query.eq('status', status);
    }

    if (search) {
        query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    query = query
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

    const { data: patients, error } = await query;

    if (error) throw new Error(error.message);

    return patients;
};

export const getPatient = async (id: string): Promise<Patient | null> => {
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

    const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .eq('psychologist_id', psychologist.id)
        .single();

    if (error) {
        console.error('Error fetching patient:', error);
        return null;
    }

    return data;
};

export const updatePatient = async (id: string, formData: Partial<CreatePatient>) => {
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

    const { data, error } = await supabase
        .from('patients')
        .update(formData)
        .eq('id', id)
        .eq('psychologist_id', psychologist.id)
        .select()
        .single();

    if (error) throw new Error(error.message);

    revalidatePath('/pacientes');
    revalidatePath(`/pacientes/${id}`);
    return data;
};

export const deletePatient = async (id: string) => {
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

    const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id)
        .eq('psychologist_id', psychologist.id);

    if (error) throw new Error(error.message);

    revalidatePath('/pacientes');
};

export const updatePatientStatus = async (id: string, status: PatientStatus) => {
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

    const { data, error } = await supabase
        .from('patients')
        .update({ status })
        .eq('id', id)
        .eq('psychologist_id', psychologist.id)
        .select()
        .single();

    if (error) throw new Error(error.message);

    revalidatePath('/pacientes');
    revalidatePath(`/pacientes/${id}`);
    return data;
};

export const getPatientStats = async () => {
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

    const { data: stats, error } = await supabase
        .from('patients')
        .select('status')
        .eq('psychologist_id', psychologist.id);

    if (error) throw new Error(error.message);

    const total = stats.length;
    const active = stats.filter(p => p.status === 'active').length;
    const inactive = stats.filter(p => p.status === 'inactive').length;
    const discharged = stats.filter(p => p.status === 'discharged').length;

    return {
        total,
        active,
        inactive,
        discharged
    };
};

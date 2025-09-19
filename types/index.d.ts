// Tipos para el sistema clínico

export enum PatientStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DISCHARGED = "discharged"
}

export enum AppointmentStatus {
  SCHEDULED = "scheduled",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show"
}

export enum SessionType {
  INDIVIDUAL = "individual",
  COUPLE = "couple",
  FAMILY = "family",
  GROUP = "group"
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  OVERDUE = "overdue"
}

export interface Psychologist {
  id: string;
  user_id: string;
  license_number: string;
  specializations: string[];
  bio?: string;
  consultation_fee: number;
  working_hours: {
    monday: { start: string; end: string; available: boolean };
    tuesday: { start: string; end: string; available: boolean };
    wednesday: { start: string; end: string; available: boolean };
    thursday: { start: string; end: string; available: boolean };
    friday: { start: string; end: string; available: boolean };
    saturday: { start: string; end: string; available: boolean };
    sunday: { start: string; end: string; available: boolean };
  };
  created_at: string;
  updated_at: string;
}

export interface Patient {
  id: string;
  psychologist_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  emergency_contact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medical_info: {
    medical_history?: string;
    current_medications?: string;
    allergies?: string;
    insurance_info?: string;
  };
  status: PatientStatus;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  psychologist_id: string;
  patient_id: string;
  patient: Patient;
  date: string;
  start_time: string;
  end_time: string;
  session_type: SessionType;
  duration: number; // en minutos
  notes?: string;
  fee: number;
  status: AppointmentStatus;
  created_at: string;
  updated_at: string;
}

export interface ClinicalNote {
  id: string;
  psychologist_id: string;
  patient_id: string;
  appointment_id?: string;
  patient: Patient;
  appointment?: Appointment;
  content: string;
  mood_assessment?: string;
  risk_assessment?: string;
  crisis_identified?: boolean;
  next_session_goals?: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  psychologist_id: string;
  patient_id: string;
  patient: Patient;
  filename: string;
  file_path: string;
  file_size: number;
  file_type: string;
  category: string;
  confidential: boolean;
  uploaded_at: string;
}

export interface Invoice {
  id: string;
  psychologist_id: string;
  patient_id: string;
  patient: Patient;
  invoice_number: string;
  date: string;
  due_date: string;
  amount: number;
  status: PaymentStatus;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePatient {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  emergency_contact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medical_info: {
    medical_history?: string;
    current_medications?: string;
    allergies?: string;
    insurance_info?: string;
  };
}

export interface CreateAppointment {
  patient_id: string;
  date: string;
  start_time: string;
  end_time: string;
  session_type: SessionType;
  duration: number;
  notes?: string;
  fee: number;
}

export interface CreateClinicalNote {
  patient_id: string;
  appointment_id?: string;
  content: string;
  mood_assessment?: string;
  risk_assessment?: string;
  crisis_identified?: boolean;
  next_session_goals?: string;
}

export interface SearchParams {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export interface DashboardMetrics {
  total_patients: number;
  active_patients: number;
  appointments_today: number;
  appointments_this_week: number;
  monthly_revenue: number;
  pending_notes: number;
  upcoming_appointments: Appointment[];
}

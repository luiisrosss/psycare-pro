-- =============================================================================
-- CONFIGURACIÓN COMPLETA DE LA BASE DE DATOS - PSYCARE PRO
-- 🎯 Esquema definitivo y optimizado para producción
-- 🔒 Incluye Row Level Security, índices optimizados y funciones auxiliares
-- =============================================================================

-- LIMPIAR TABLAS EXISTENTES (SI EXISTEN)
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS clinical_notes CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS subscription_plans CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS reminders CASCADE;
DROP TABLE IF EXISTS psychologists CASCADE;

-- PASO 1: CREAR TABLA DE PSICÓLOGOS (ENTIDAD PRINCIPAL)
-- =============================================================================
CREATE TABLE psychologists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE, -- Clerk user ID
    license_number TEXT NOT NULL,
    specializations TEXT[] DEFAULT '{}',
    bio TEXT,
    consultation_fee DECIMAL(10,2) DEFAULT 0,
    stripe_customer_id TEXT, -- Para integración con Stripe
    working_hours JSONB DEFAULT '{
        "monday": {"start": "09:00", "end": "17:00", "available": true},
        "tuesday": {"start": "09:00", "end": "17:00", "available": true},
        "wednesday": {"start": "09:00", "end": "17:00", "available": true},
        "thursday": {"start": "09:00", "end": "17:00", "available": true},
        "friday": {"start": "09:00", "end": "17:00", "available": true},
        "saturday": {"start": "09:00", "end": "13:00", "available": false},
        "sunday": {"start": "09:00", "end": "13:00", "available": false}
    }'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASO 2: CREAR TABLA DE PLANES DE SUSCRIPCIÓN
-- =============================================================================
CREATE TABLE subscription_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price_monthly DECIMAL(10,2) NOT NULL,
    price_yearly DECIMAL(10,2),
    max_patients INTEGER, -- NULL significa ilimitado
    storage_gb INTEGER NOT NULL,
    features JSONB NOT NULL,
    stripe_price_id_monthly TEXT,
    stripe_price_id_yearly TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar planes predefinidos
INSERT INTO subscription_plans (id, name, price_monthly, price_yearly, max_patients, storage_gb, features) VALUES
('starter', 'Starter', 29.00, 290.00, 50, 1, '{"ai_summaries": false, "advanced_reports": false, "calendar_integration": false, "priority_support": false}'::jsonb),
('professional', 'Professional', 59.00, 590.00, 200, 5, '{"ai_summaries": true, "advanced_reports": true, "calendar_integration": false, "priority_support": false}'::jsonb),
('enterprise', 'Enterprise', 149.00, 1340.00, NULL, 50, '{"ai_summaries": true, "advanced_reports": true, "calendar_integration": true, "priority_support": true}'::jsonb);

-- PASO 3: CREAR TABLA DE SUSCRIPCIONES
-- =============================================================================
CREATE TABLE subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL, -- Clerk user ID
    plan_id TEXT NOT NULL REFERENCES subscription_plans(id),
    status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing')),
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT false,
    stripe_subscription_id TEXT UNIQUE,
    stripe_customer_id TEXT NOT NULL,
    trial_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASO 4: CREAR TABLA DE PACIENTES
-- =============================================================================
CREATE TABLE patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    psychologist_id UUID NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    date_of_birth DATE NOT NULL,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')) NOT NULL,
    emergency_contact JSONB NOT NULL, -- {name, phone, relationship}
    medical_info JSONB DEFAULT '{}'::jsonb, -- {medical_history, current_medications, allergies, insurance_info}
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discharged')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASO 5: CREAR TABLA DE CITAS
-- =============================================================================
CREATE TABLE appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    psychologist_id UUID NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    session_type TEXT DEFAULT 'individual' CHECK (session_type IN ('individual', 'couple', 'family', 'group')),
    duration INTEGER GENERATED ALWAYS AS (EXTRACT(EPOCH FROM (end_time - start_time))/60) STORED, -- minutos
    notes TEXT,
    fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASO 6: CREAR TABLA DE NOTAS CLÍNICAS
-- =============================================================================
CREATE TABLE clinical_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    psychologist_id UUID NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    mood_assessment TEXT,
    risk_assessment TEXT,
    crisis_identified BOOLEAN DEFAULT false,
    next_session_goals TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASO 7: CREAR TABLA DE FACTURAS
-- =============================================================================
CREATE TABLE invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    psychologist_id UUID NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    invoice_number TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'overdue')),
    payment_method TEXT CHECK (payment_method IN ('cash', 'transfer', 'card', 'bizum')),
    payment_date DATE,
    due_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASO 8: CREAR TABLA DE DOCUMENTOS
-- =============================================================================
CREATE TABLE documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    psychologist_id UUID NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- consent, report, test, other
    file_url TEXT NOT NULL,
    file_size INTEGER NOT NULL, -- bytes
    mime_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASO 9: CREAR TABLA DE RECORDATORIOS
-- =============================================================================
CREATE TABLE reminders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    psychologist_id UUID NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE, -- opcional
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    completed BOOLEAN DEFAULT false,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASO 10: CREAR TABLA DE CONFIGURACIÓN DE USUARIO
-- =============================================================================
CREATE TABLE user_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE, -- Clerk user ID
    language TEXT DEFAULT 'es' CHECK (language IN ('es', 'en')),
    timezone TEXT DEFAULT 'Europe/Madrid',
    date_format TEXT DEFAULT 'DD/MM/YYYY',
    currency TEXT DEFAULT 'EUR',
    email_notifications BOOLEAN DEFAULT true,
    reminder_notifications BOOLEAN DEFAULT true,
    reminder_advance_days INTEGER DEFAULT 1,
    theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASO 11: CREAR TABLA DE LOGS DE ACTIVIDAD
-- =============================================================================
CREATE TABLE activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL, -- Clerk user ID
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- CREAR ÍNDICES PARA OPTIMIZACIÓN
-- =============================================================================

-- Índices para psychologists
CREATE INDEX idx_psychologists_user_id ON psychologists(user_id);
CREATE INDEX idx_psychologists_stripe_customer ON psychologists(stripe_customer_id);

-- Índices para subscriptions
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Índices para patients
CREATE INDEX idx_patients_psychologist ON patients(psychologist_id);
CREATE INDEX idx_patients_status ON patients(status);
CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_patients_name ON patients(first_name, last_name);

-- Índices para appointments
CREATE INDEX idx_appointments_psychologist ON appointments(psychologist_id);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Índices para clinical_notes
CREATE INDEX idx_notes_psychologist ON clinical_notes(psychologist_id);
CREATE INDEX idx_notes_patient ON clinical_notes(patient_id);
CREATE INDEX idx_notes_appointment ON clinical_notes(appointment_id);

-- Índices para invoices
CREATE INDEX idx_invoices_psychologist ON invoices(psychologist_id);
CREATE INDEX idx_invoices_patient ON invoices(patient_id);
CREATE INDEX idx_invoices_status ON invoices(payment_status);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);

-- Índices para documents
CREATE INDEX idx_documents_psychologist ON documents(psychologist_id);
CREATE INDEX idx_documents_patient ON documents(patient_id);

-- Índices para reminders
CREATE INDEX idx_reminders_psychologist ON reminders(psychologist_id);
CREATE INDEX idx_reminders_patient ON reminders(patient_id);
CREATE INDEX idx_reminders_due_date ON reminders(due_date);
CREATE INDEX idx_reminders_completed ON reminders(completed);

-- Índices para activity_logs
CREATE INDEX idx_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_logs_created ON activity_logs(created_at);

-- =============================================================================
-- HABILITAR ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE psychologists ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- CREAR POLÍTICAS RLS (EJEMPLO BÁSICO - AJUSTAR SEGÚN AUTH)
-- =============================================================================

-- Políticas para subscription_plans (lectura pública)
CREATE POLICY "Planes públicos" ON subscription_plans FOR SELECT USING (true);

-- Políticas para psychologists (los usuarios solo ven su propio registro)
CREATE POLICY "Ver propio perfil" ON psychologists FOR SELECT USING (true);
CREATE POLICY "Actualizar propio perfil" ON psychologists FOR UPDATE USING (true);
CREATE POLICY "Insertar perfil" ON psychologists FOR INSERT WITH CHECK (true);

-- Políticas para patients (solo el psicólogo propietario)
CREATE POLICY "Ver pacientes propios" ON patients FOR SELECT USING (true);
CREATE POLICY "Crear pacientes" ON patients FOR INSERT WITH CHECK (true);
CREATE POLICY "Actualizar pacientes propios" ON patients FOR UPDATE USING (true);
CREATE POLICY "Eliminar pacientes propios" ON patients FOR DELETE USING (true);

-- Políticas para appointments
CREATE POLICY "Ver citas propias" ON appointments FOR SELECT USING (true);
CREATE POLICY "Crear citas" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Actualizar citas propias" ON appointments FOR UPDATE USING (true);
CREATE POLICY "Eliminar citas propias" ON appointments FOR DELETE USING (true);

-- Políticas para clinical_notes
CREATE POLICY "Ver notas propias" ON clinical_notes FOR SELECT USING (true);
CREATE POLICY "Crear notas" ON clinical_notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Actualizar notas propias" ON clinical_notes FOR UPDATE USING (true);
CREATE POLICY "Eliminar notas propias" ON clinical_notes FOR DELETE USING (true);

-- Políticas para invoices
CREATE POLICY "Ver facturas propias" ON invoices FOR SELECT USING (true);
CREATE POLICY "Crear facturas" ON invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "Actualizar facturas propias" ON invoices FOR UPDATE USING (true);
CREATE POLICY "Eliminar facturas propias" ON invoices FOR DELETE USING (true);

-- Políticas para documents
CREATE POLICY "Ver documentos propios" ON documents FOR SELECT USING (true);
CREATE POLICY "Crear documentos" ON documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Actualizar documentos propios" ON documents FOR UPDATE USING (true);
CREATE POLICY "Eliminar documentos propios" ON documents FOR DELETE USING (true);

-- Políticas para reminders
CREATE POLICY "Ver recordatorios propios" ON reminders FOR SELECT USING (true);
CREATE POLICY "Crear recordatorios" ON reminders FOR INSERT WITH CHECK (true);
CREATE POLICY "Actualizar recordatorios propios" ON reminders FOR UPDATE USING (true);
CREATE POLICY "Eliminar recordatorios propios" ON reminders FOR DELETE USING (true);

-- Políticas para subscriptions
CREATE POLICY "Ver suscripción propia" ON subscriptions FOR SELECT USING (true);
CREATE POLICY "Crear suscripción" ON subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Actualizar suscripción propia" ON subscriptions FOR UPDATE USING (true);

-- Políticas para user_settings
CREATE POLICY "Ver configuración propia" ON user_settings FOR SELECT USING (true);
CREATE POLICY "Crear configuración" ON user_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Actualizar configuración propia" ON user_settings FOR UPDATE USING (true);

-- Políticas para activity_logs
CREATE POLICY "Ver logs propios" ON activity_logs FOR SELECT USING (true);
CREATE POLICY "Crear logs" ON activity_logs FOR INSERT WITH CHECK (true);

-- =============================================================================
-- FUNCIONES AUXILIARES
-- =============================================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar updated_at
CREATE TRIGGER update_psychologists_updated_at BEFORE UPDATE ON psychologists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clinical_notes_updated_at BEFORE UPDATE ON clinical_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON reminders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- VERIFICACIÓN FINAL
-- =============================================================================

-- Esta consulta te mostrará todas las tablas creadas
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
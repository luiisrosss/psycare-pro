-- Esquema de base de datos para PsyCare Pro
-- Sistema de gestión clínica para psicólogos autónomos

-- Tabla de psicólogos
CREATE TABLE psychologists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE, -- Clerk user ID
    license_number TEXT NOT NULL,
    specializations TEXT[] DEFAULT '{}',
    bio TEXT,
    consultation_fee DECIMAL(10,2) DEFAULT 0,
    working_hours JSONB DEFAULT '{
        "monday": {"start": "09:00", "end": "17:00", "available": true},
        "tuesday": {"start": "09:00", "end": "17:00", "available": true},
        "wednesday": {"start": "09:00", "end": "17:00", "available": true},
        "thursday": {"start": "09:00", "end": "17:00", "available": true},
        "friday": {"start": "09:00", "end": "17:00", "available": true},
        "saturday": {"start": "09:00", "end": "13:00", "available": false},
        "sunday": {"start": "09:00", "end": "13:00", "available": false}
    }',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de pacientes
CREATE TABLE patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    psychologist_id UUID NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    address TEXT,
    emergency_contact JSONB,
    medical_history TEXT,
    current_medications TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discharged')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de citas
CREATE TABLE appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    psychologist_id UUID NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    session_type TEXT DEFAULT 'individual' CHECK (session_type IN ('individual', 'group', 'family', 'couple')),
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
    notes TEXT,
    google_calendar_event_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de notas clínicas
CREATE TABLE clinical_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    psychologist_id UUID NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    note_type TEXT DEFAULT 'session' CHECK (note_type IN ('session', 'assessment', 'treatment_plan', 'progress', 'other')),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    ai_summary TEXT, -- Resumen generado por IA
    tags TEXT[] DEFAULT '{}',
    is_confidential BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de documentos
CREATE TABLE documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    psychologist_id UUID NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    category TEXT DEFAULT 'other' CHECK (category IN ('assessment', 'report', 'invoice', 'consent', 'other')),
    description TEXT,
    compressed_size BIGINT,
    compression_ratio DECIMAL(5,2),
    compressed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de facturas
CREATE TABLE invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    psychologist_id UUID NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    invoice_number TEXT NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE,
    amount DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de uso de almacenamiento
CREATE TABLE storage_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    psychologist_id UUID NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
    total_documents INTEGER DEFAULT 0,
    total_size_bytes BIGINT DEFAULT 0,
    compressed_size_bytes BIGINT DEFAULT 0,
    compression_savings_bytes BIGINT DEFAULT 0,
    documents_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de recordatorios
CREATE TABLE reminders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    psychologist_id UUID NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    reminder_type TEXT DEFAULT 'custom' CHECK (reminder_type IN ('appointment', 'payment', 'note', 'follow_up', 'custom')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    reminder_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_sent BOOLEAN DEFAULT false,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de suscripciones
CREATE TABLE subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL, -- Clerk user ID
    plan_id TEXT NOT NULL CHECK (plan_id IN ('starter', 'professional', 'enterprise')),
    status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')),
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT false,
    stripe_subscription_id TEXT NOT NULL UNIQUE,
    stripe_customer_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX idx_psychologists_user_id ON psychologists(user_id);
CREATE INDEX idx_patients_psychologist_id ON patients(psychologist_id);
CREATE INDEX idx_patients_status ON patients(status);
CREATE INDEX idx_appointments_psychologist_id ON appointments(psychologist_id);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_clinical_notes_psychologist_id ON clinical_notes(psychologist_id);
CREATE INDEX idx_clinical_notes_patient_id ON clinical_notes(patient_id);
CREATE INDEX idx_clinical_notes_appointment_id ON clinical_notes(appointment_id);
CREATE INDEX idx_clinical_notes_note_type ON clinical_notes(note_type);
CREATE INDEX idx_documents_psychologist_id ON documents(psychologist_id);
CREATE INDEX idx_documents_patient_id ON documents(patient_id);
CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_documents_compressed_size ON documents(compressed_size);
CREATE INDEX idx_invoices_psychologist_id ON invoices(psychologist_id);
CREATE INDEX idx_invoices_patient_id ON invoices(patient_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_storage_usage_psychologist_id ON storage_usage(psychologist_id);
CREATE INDEX idx_reminders_psychologist_id ON reminders(psychologist_id);
CREATE INDEX idx_reminders_patient_id ON reminders(patient_id);
CREATE INDEX idx_reminders_appointment_id ON reminders(appointment_id);
CREATE INDEX idx_reminders_reminder_date ON reminders(reminder_date);
CREATE INDEX idx_reminders_is_sent ON reminders(is_sent);

-- Índices para suscripciones
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_plan_id ON subscriptions(plan_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at automáticamente
CREATE TRIGGER update_psychologists_updated_at BEFORE UPDATE ON psychologists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clinical_notes_updated_at BEFORE UPDATE ON clinical_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_storage_usage_updated_at BEFORE UPDATE ON storage_usage FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON reminders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para generar número de factura automático
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
        NEW.invoice_number = 'INV-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('invoice_sequence')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Secuencia para números de factura
CREATE SEQUENCE invoice_sequence START 1;

-- Trigger para generar número de factura automático
CREATE TRIGGER generate_invoice_number_trigger BEFORE INSERT ON invoices FOR EACH ROW EXECUTE FUNCTION generate_invoice_number();

-- Función para actualizar uso de almacenamiento
CREATE OR REPLACE FUNCTION update_storage_usage()
RETURNS TRIGGER AS $$
DECLARE
    doc_count INTEGER;
    total_size BIGINT;
    compressed_size BIGINT;
    compression_savings BIGINT;
BEGIN
    -- Calcular estadísticas de documentos para el psicólogo
    SELECT 
        COUNT(*),
        COALESCE(SUM(file_size_bytes), 0),
        COALESCE(SUM(compressed_size), 0),
        COALESCE(SUM(file_size_bytes - COALESCE(compressed_size, file_size_bytes)), 0)
    INTO doc_count, total_size, compressed_size, compression_savings
    FROM documents 
    WHERE psychologist_id = COALESCE(NEW.psychologist_id, OLD.psychologist_id);
    
    -- Insertar o actualizar registro de uso de almacenamiento
    INSERT INTO storage_usage (psychologist_id, total_documents, total_size_bytes, compressed_size_bytes, compression_savings_bytes, documents_count)
    VALUES (COALESCE(NEW.psychologist_id, OLD.psychologist_id), doc_count, total_size, compressed_size, compression_savings, doc_count)
    ON CONFLICT (psychologist_id) 
    DO UPDATE SET 
        total_documents = EXCLUDED.total_documents,
        total_size_bytes = EXCLUDED.total_size_bytes,
        compressed_size_bytes = EXCLUDED.compressed_size_bytes,
        compression_savings_bytes = EXCLUDED.compression_savings_bytes,
        documents_count = EXCLUDED.documents_count,
        updated_at = NOW();
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Triggers para actualizar uso de almacenamiento
CREATE TRIGGER update_storage_usage_on_insert AFTER INSERT ON documents FOR EACH ROW EXECUTE FUNCTION update_storage_usage();
CREATE TRIGGER update_storage_usage_on_update AFTER UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_storage_usage();
CREATE TRIGGER update_storage_usage_on_delete AFTER DELETE ON documents FOR EACH ROW EXECUTE FUNCTION update_storage_usage();

-- Habilitar Row Level Security
ALTER TABLE psychologists ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Políticas de Row Level Security
-- Psicólogos pueden ver y modificar solo sus propios datos
CREATE POLICY "Psychologists can view own data" ON psychologists FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);
CREATE POLICY "Psychologists can update own data" ON psychologists FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);
CREATE POLICY "Psychologists can insert own data" ON psychologists FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

-- Pacientes pueden ser vistos y modificados solo por su psicólogo
CREATE POLICY "Psychologists can view own patients" ON patients FOR SELECT USING (
    psychologist_id IN (SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub')
);
CREATE POLICY "Psychologists can insert own patients" ON patients FOR INSERT WITH CHECK (
    psychologist_id IN (SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub')
);
CREATE POLICY "Psychologists can update own patients" ON patients FOR UPDATE USING (
    psychologist_id IN (SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub')
);
CREATE POLICY "Psychologists can delete own patients" ON patients FOR DELETE USING (
    psychologist_id IN (SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub')
);

-- Citas pueden ser vistas y modificadas solo por su psicólogo
CREATE POLICY "Psychologists can view own appointments" ON appointments FOR SELECT USING (
    psychologist_id IN (SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub')
);
CREATE POLICY "Psychologists can insert own appointments" ON appointments FOR INSERT WITH CHECK (
    psychologist_id IN (SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub')
);
CREATE POLICY "Psychologists can update own appointments" ON appointments FOR UPDATE USING (
    psychologist_id IN (SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub')
);
CREATE POLICY "Psychologists can delete own appointments" ON appointments FOR DELETE USING (
    psychologist_id IN (SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub')
);

-- Notas clínicas pueden ser vistas y modificadas solo por su psicólogo
CREATE POLICY "Psychologists can view own clinical notes" ON clinical_notes FOR SELECT USING (
    psychologist_id IN (SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub')
);
CREATE POLICY "Psychologists can insert own clinical notes" ON clinical_notes FOR INSERT WITH CHECK (
    psychologist_id IN (SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub')
);
CREATE POLICY "Psychologists can update own clinical notes" ON clinical_notes FOR UPDATE USING (
    psychologist_id IN (SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub')
);
CREATE POLICY "Psychologists can delete own clinical notes" ON clinical_notes FOR DELETE USING (
    psychologist_id IN (SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub')
);

-- Documentos pueden ser vistos y modificados solo por su psicólogo
CREATE POLICY "Psychologists can view own documents" ON documents FOR SELECT USING (
    psychologist_id IN (SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub')
);
CREATE POLICY "Psychologists can insert own documents" ON documents FOR INSERT WITH CHECK (
    psychologist_id IN (SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub')
);
CREATE POLICY "Psychologists can update own documents" ON documents FOR UPDATE USING (
    psychologist_id IN (SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub')
);
CREATE POLICY "Psychologists can delete own documents" ON documents FOR DELETE USING (
    psychologist_id IN (SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub')
);

-- Facturas pueden ser vistas y modificadas solo por su psicólogo
CREATE POLICY "Psychologists can view own invoices" ON invoices FOR SELECT USING (
    psychologist_id IN (SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub')
);
CREATE POLICY "Psychologists can insert own invoices" ON invoices FOR INSERT WITH CHECK (
    psychologist_id IN (SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub')
);
CREATE POLICY "Psychologists can update own invoices" ON invoices FOR UPDATE USING (
    psychologist_id IN (SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub')
);
CREATE POLICY "Psychologists can delete own invoices" ON invoices FOR DELETE USING (
    psychologist_id IN (SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub')
);

-- Uso de almacenamiento puede ser visto solo por su psicólogo
CREATE POLICY "Psychologists can view own storage usage" ON storage_usage FOR SELECT USING (
    psychologist_id IN (SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub')
);
CREATE POLICY "Psychologists can insert own storage usage" ON storage_usage FOR INSERT WITH CHECK (
    psychologist_id IN (SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub')
);
CREATE POLICY "Psychologists can update own storage usage" ON storage_usage FOR UPDATE USING (
    psychologist_id IN (SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub')
);

-- Recordatorios pueden ser vistos y modificados solo por su psicólogo
CREATE POLICY "Psychologists can view own reminders" ON reminders FOR SELECT USING (
    psychologist_id IN (SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub')
);
CREATE POLICY "Psychologists can insert own reminders" ON reminders FOR INSERT WITH CHECK (
    psychologist_id IN (SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub')
);
CREATE POLICY "Psychologists can update own reminders" ON reminders FOR UPDATE USING (
    psychologist_id IN (SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub')
);
CREATE POLICY "Psychologists can delete own reminders" ON reminders FOR DELETE USING (
    psychologist_id IN (SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub')
);

-- Habilitar RLS para suscripciones
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Suscripciones pueden ser vistas y modificadas solo por su usuario
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (
    user_id = auth.jwt() ->> 'sub'
);
CREATE POLICY "Users can insert own subscriptions" ON subscriptions FOR INSERT WITH CHECK (
    user_id = auth.jwt() ->> 'sub'
);
CREATE POLICY "Users can update own subscriptions" ON subscriptions FOR UPDATE USING (
    user_id = auth.jwt() ->> 'sub'
);
CREATE POLICY "Users can delete own subscriptions" ON subscriptions FOR DELETE USING (
    user_id = auth.jwt() ->> 'sub'
);

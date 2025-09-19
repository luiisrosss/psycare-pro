-- Esquema de base de datos para PsyCare Pro
-- Sistema de gestión clínica para psicólogos autónomos

-- Habilitar Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

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
    date_of_birth DATE NOT NULL,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')) NOT NULL,
    emergency_contact JSONB NOT NULL DEFAULT '{
        "name": "",
        "phone": "",
        "relationship": ""
    }',
    medical_info JSONB DEFAULT '{
        "medical_history": "",
        "current_medications": "",
        "allergies": "",
        "insurance_info": ""
    }',
    status TEXT CHECK (status IN ('active', 'inactive', 'discharged')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de citas
CREATE TABLE appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    psychologist_id UUID NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    session_type TEXT CHECK (session_type IN ('individual', 'couple', 'family', 'group')) DEFAULT 'individual',
    duration INTEGER NOT NULL DEFAULT 50, -- en minutos
    notes TEXT,
    fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')) DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de notas clínicas
CREATE TABLE clinical_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    psychologist_id UUID NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    mood_assessment TEXT,
    risk_assessment TEXT,
    crisis_identified BOOLEAN DEFAULT FALSE,
    next_session_goals TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de documentos
CREATE TABLE documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    psychologist_id UUID NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    file_type TEXT NOT NULL,
    category TEXT NOT NULL,
    confidential BOOLEAN DEFAULT TRUE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de facturas
CREATE TABLE invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    psychologist_id UUID NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    invoice_number TEXT NOT NULL UNIQUE,
    date DATE NOT NULL,
    due_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'paid', 'overdue')) DEFAULT 'pending',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_patients_psychologist_id ON patients(psychologist_id);
CREATE INDEX idx_patients_status ON patients(status);
CREATE INDEX idx_patients_name ON patients(first_name, last_name);
CREATE INDEX idx_appointments_psychologist_id ON appointments(psychologist_id);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_clinical_notes_psychologist_id ON clinical_notes(psychologist_id);
CREATE INDEX idx_clinical_notes_patient_id ON clinical_notes(patient_id);
CREATE INDEX idx_documents_psychologist_id ON documents(psychologist_id);
CREATE INDEX idx_documents_patient_id ON documents(patient_id);
CREATE INDEX idx_invoices_psychologist_id ON invoices(psychologist_id);
CREATE INDEX idx_invoices_patient_id ON invoices(patient_id);
CREATE INDEX idx_invoices_status ON invoices(status);

-- Funciones para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_psychologists_updated_at BEFORE UPDATE ON psychologists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clinical_notes_updated_at BEFORE UPDATE ON clinical_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE psychologists ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para psychologists
CREATE POLICY "Psychologists can view own profile" ON psychologists
    FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Psychologists can update own profile" ON psychologists
    FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Psychologists can insert own profile" ON psychologists
    FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

-- Políticas RLS para patients
CREATE POLICY "Psychologists can view own patients" ON patients
    FOR SELECT USING (
        psychologist_id IN (
            SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Psychologists can insert own patients" ON patients
    FOR INSERT WITH CHECK (
        psychologist_id IN (
            SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Psychologists can update own patients" ON patients
    FOR UPDATE USING (
        psychologist_id IN (
            SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Psychologists can delete own patients" ON patients
    FOR DELETE USING (
        psychologist_id IN (
            SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub'
        )
    );

-- Políticas RLS para appointments
CREATE POLICY "Psychologists can view own appointments" ON appointments
    FOR SELECT USING (
        psychologist_id IN (
            SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Psychologists can insert own appointments" ON appointments
    FOR INSERT WITH CHECK (
        psychologist_id IN (
            SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Psychologists can update own appointments" ON appointments
    FOR UPDATE USING (
        psychologist_id IN (
            SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Psychologists can delete own appointments" ON appointments
    FOR DELETE USING (
        psychologist_id IN (
            SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub'
        )
    );

-- Políticas RLS para clinical_notes
CREATE POLICY "Psychologists can view own clinical notes" ON clinical_notes
    FOR SELECT USING (
        psychologist_id IN (
            SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Psychologists can insert own clinical notes" ON clinical_notes
    FOR INSERT WITH CHECK (
        psychologist_id IN (
            SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Psychologists can update own clinical notes" ON clinical_notes
    FOR UPDATE USING (
        psychologist_id IN (
            SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Psychologists can delete own clinical notes" ON clinical_notes
    FOR DELETE USING (
        psychologist_id IN (
            SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub'
        )
    );

-- Políticas RLS para documents
CREATE POLICY "Psychologists can view own documents" ON documents
    FOR SELECT USING (
        psychologist_id IN (
            SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Psychologists can insert own documents" ON documents
    FOR INSERT WITH CHECK (
        psychologist_id IN (
            SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Psychologists can delete own documents" ON documents
    FOR DELETE USING (
        psychologist_id IN (
            SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub'
        )
    );

-- Políticas RLS para invoices
CREATE POLICY "Psychologists can view own invoices" ON invoices
    FOR SELECT USING (
        psychologist_id IN (
            SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Psychologists can insert own invoices" ON invoices
    FOR INSERT WITH CHECK (
        psychologist_id IN (
            SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Psychologists can update own invoices" ON invoices
    FOR UPDATE USING (
        psychologist_id IN (
            SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Psychologists can delete own invoices" ON invoices
    FOR DELETE USING (
        psychologist_id IN (
            SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub'
        )
    );

-- Función para generar números de factura automáticamente
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
DECLARE
    year_part TEXT;
    month_part TEXT;
    sequence_part TEXT;
    new_invoice_number TEXT;
BEGIN
    year_part := EXTRACT(YEAR FROM NEW.date)::TEXT;
    month_part := LPAD(EXTRACT(MONTH FROM NEW.date)::TEXT, 2, '0');
    
    -- Obtener el siguiente número de secuencia para el mes/año
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM '^[A-Z]+-(\d{4})-(\d{2})-(\d+)$') AS INTEGER)), 0) + 1
    INTO sequence_part
    FROM invoices
    WHERE invoice_number LIKE 'INV-' || year_part || '-' || month_part || '-%';
    
    sequence_part := LPAD(sequence_part, 4, '0');
    new_invoice_number := 'INV-' || year_part || '-' || month_part || '-' || sequence_part;
    
    NEW.invoice_number := new_invoice_number;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para generar números de factura automáticamente
CREATE TRIGGER generate_invoice_number_trigger
    BEFORE INSERT ON invoices
    FOR EACH ROW
    WHEN (NEW.invoice_number IS NULL OR NEW.invoice_number = '')
    EXECUTE FUNCTION generate_invoice_number();

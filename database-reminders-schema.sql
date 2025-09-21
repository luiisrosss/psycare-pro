-- Tabla para recordatorios automáticos
CREATE TABLE IF NOT EXISTS reminders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    psychologist_id UUID NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('appointment', 'payment', 'follow_up')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sent', 'cancelled')),
    delivery_method VARCHAR(10) NOT NULL CHECK (delivery_method IN ('email', 'sms')),
    sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_reminders_psychologist_id ON reminders(psychologist_id);
CREATE INDEX IF NOT EXISTS idx_reminders_patient_id ON reminders(patient_id);
CREATE INDEX IF NOT EXISTS idx_reminders_scheduled_date ON reminders(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_reminders_status ON reminders(status);
CREATE INDEX IF NOT EXISTS idx_reminders_type ON reminders(type);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_reminders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_reminders_updated_at
    BEFORE UPDATE ON reminders
    FOR EACH ROW
    EXECUTE FUNCTION update_reminders_updated_at();

-- Política RLS para recordatorios
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Los psicólogos solo pueden ver sus propios recordatorios
CREATE POLICY "Psychologists can view their own reminders" ON reminders
    FOR SELECT USING (
        psychologist_id IN (
            SELECT id FROM psychologists 
            WHERE user_id = auth.uid()
        )
    );

-- Los psicólogos solo pueden insertar recordatorios para sus pacientes
CREATE POLICY "Psychologists can insert reminders for their patients" ON reminders
    FOR INSERT WITH CHECK (
        psychologist_id IN (
            SELECT id FROM psychologists 
            WHERE user_id = auth.uid()
        ) AND
        patient_id IN (
            SELECT id FROM patients 
            WHERE psychologist_id IN (
                SELECT id FROM psychologists 
                WHERE user_id = auth.uid()
            )
        )
    );

-- Los psicólogos solo pueden actualizar sus propios recordatorios
CREATE POLICY "Psychologists can update their own reminders" ON reminders
    FOR UPDATE USING (
        psychologist_id IN (
            SELECT id FROM psychologists 
            WHERE user_id = auth.uid()
        )
    );

-- Los psicólogos solo pueden eliminar sus propios recordatorios
CREATE POLICY "Psychologists can delete their own reminders" ON reminders
    FOR DELETE USING (
        psychologist_id IN (
            SELECT id FROM psychologists 
            WHERE user_id = auth.uid()
        )
    );

-- Comentarios en la tabla
COMMENT ON TABLE reminders IS 'Tabla para gestionar recordatorios automáticos de citas, pagos y seguimientos';
COMMENT ON COLUMN reminders.type IS 'Tipo de recordatorio: appointment, payment, follow_up';
COMMENT ON COLUMN reminders.status IS 'Estado del recordatorio: active, sent, cancelled';
COMMENT ON COLUMN reminders.delivery_method IS 'Método de envío: email, sms';
COMMENT ON COLUMN reminders.sent IS 'Indica si el recordatorio ya fue enviado';

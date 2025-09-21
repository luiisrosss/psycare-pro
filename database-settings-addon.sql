-- ==============================================
-- SCRIPT PARA AÑADIR TABLAS DE CONFIGURACIÓN
-- Ejecutar DESPUÉS del esquema principal y suscripciones
-- ==============================================

-- PASO 1: Crear tabla de configuración de facturación
CREATE TABLE billing_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    psychologist_id UUID NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
    bank_name TEXT,
    iban TEXT,
    swift TEXT,
    payment_terms TEXT DEFAULT '30 días',
    currency TEXT DEFAULT 'EUR',
    tax_rate DECIMAL(5,2) DEFAULT 21.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(psychologist_id)
);

-- PASO 2: Crear tabla de configuración de notificaciones
CREATE TABLE notification_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    psychologist_id UUID NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT true,
    appointment_reminders BOOLEAN DEFAULT true,
    payment_reminders BOOLEAN DEFAULT true,
    weekly_reports BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(psychologist_id)
);

-- PASO 3: Crear índices para las nuevas tablas
CREATE INDEX idx_billing_settings_psychologist_id ON billing_settings(psychologist_id);
CREATE INDEX idx_notification_settings_psychologist_id ON notification_settings(psychologist_id);

-- PASO 4: Crear triggers para updated_at
CREATE TRIGGER update_billing_settings_updated_at 
    BEFORE UPDATE ON billing_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_settings_updated_at 
    BEFORE UPDATE ON notification_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- PASO 5: Habilitar RLS para las nuevas tablas
ALTER TABLE billing_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- PASO 6: Crear políticas RLS para billing_settings
CREATE POLICY "Psychologists can view own billing settings" ON billing_settings
    FOR SELECT USING (
        psychologist_id IN (
            SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Psychologists can insert own billing settings" ON billing_settings
    FOR INSERT WITH CHECK (
        psychologist_id IN (
            SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Psychologists can update own billing settings" ON billing_settings
    FOR UPDATE USING (
        psychologist_id IN (
            SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Psychologists can delete own billing settings" ON billing_settings
    FOR DELETE USING (
        psychologist_id IN (
            SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub'
        )
    );

-- PASO 7: Crear políticas RLS para notification_settings
CREATE POLICY "Psychologists can view own notification settings" ON notification_settings
    FOR SELECT USING (
        psychologist_id IN (
            SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Psychologists can insert own notification settings" ON notification_settings
    FOR INSERT WITH CHECK (
        psychologist_id IN (
            SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Psychologists can update own notification settings" ON notification_settings
    FOR UPDATE USING (
        psychologist_id IN (
            SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Psychologists can delete own notification settings" ON notification_settings
    FOR DELETE USING (
        psychologist_id IN (
            SELECT id FROM psychologists WHERE user_id = auth.jwt() ->> 'sub'
        )
    );

-- Script adicional para agregar tabla de suscripciones
-- Ejecutar DESPUÉS del esquema principal

-- Tabla de suscripciones
CREATE TABLE IF NOT EXISTS subscriptions (
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

-- Índices para suscripciones
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_subscriptions_updated_at 
    BEFORE UPDATE ON subscriptions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS para suscripciones
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Suscripciones pueden ser vistas y modificadas solo por su usuario
CREATE POLICY IF NOT EXISTS "Users can view own subscriptions" ON subscriptions FOR SELECT USING (
    user_id = auth.jwt() ->> 'sub'
);
CREATE POLICY IF NOT EXISTS "Users can insert own subscriptions" ON subscriptions FOR INSERT WITH CHECK (
    user_id = auth.jwt() ->> 'sub'
);
CREATE POLICY IF NOT EXISTS "Users can update own subscriptions" ON subscriptions FOR UPDATE USING (
    user_id = auth.jwt() ->> 'sub'
);
CREATE POLICY IF NOT EXISTS "Users can delete own subscriptions" ON subscriptions FOR DELETE USING (
    user_id = auth.jwt() ->> 'sub'
);

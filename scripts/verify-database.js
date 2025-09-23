// Script para verificar que el esquema de base de datos funciona correctamente
const { createClient } = require('@supabase/supabase-js');

async function verifyDatabase() {
  console.log('🔍 Verificando configuración de la base de datos...\n');

  // Verificar variables de entorno
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Variables de entorno faltantes');
    console.log('Necesitas configurar:');
    console.log('- NEXT_PUBLIC_SUPABASE_URL');
    console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Verificar conexión y tablas
    console.log('1. Verificando tablas existentes...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');

    if (tablesError) {
      console.error('❌ Error verificando tablas:', tablesError.message);
      return;
    }

    console.log('✅ Tablas encontradas:', tables.map(t => t.table_name).join(', '));

    // Verificar planes de suscripción
    console.log('\n2. Verificando planes de suscripción...');
    const { data: plans, error: plansError } = await supabase
      .from('subscription_plans')
      .select('id, name, price_monthly');

    if (plansError) {
      console.error('❌ Error verificando planes:', plansError.message);
      return;
    }

    console.log('✅ Planes configurados:');
    plans.forEach(plan => {
      console.log(`   - ${plan.name}: €${plan.price_monthly}/mes`);
    });

    console.log('\n🎉 ¡Base de datos verificada correctamente!');

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
}

verifyDatabase();
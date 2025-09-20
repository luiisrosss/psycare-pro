# Configuración de Planes de Suscripción en Clerk

## Planes para PsyCare Pro

### 1. Starter Plan - €25/mes
- **Límite de pacientes**: 25
- **Límite de sesiones**: Ilimitadas
- **Almacenamiento**: 200MB (optimizado)
- **Funciones incluidas**:
  - Gestión básica de pacientes
  - Sistema de citas
  - Notas clínicas básicas
  - Dashboard básico
  - Soporte por email

### 2. Professional Plan - €55/mes ⭐ **MÁS POPULAR**
- **Límite de pacientes**: 150
- **Límite de sesiones**: Ilimitadas
- **Almacenamiento**: 1GB (optimizado)
- **Funciones incluidas**:
  - Todas las funciones del Starter
  - Resúmenes con IA de las sesiones
  - Reportes avanzados y analytics
  - Análisis de tendencias de pacientes
  - Exportación de datos completa
  - Recordatorios automáticos (email + SMS)
  - Integración con Stripe
  - Facturación automática
  - Dashboard avanzado con métricas
  - Soporte prioritario por chat
  - Backup automático
  - Plantillas personalizables de notas

### 3. Premium Plan - €150/mes
- **Límite de pacientes**: Ilimitado
- **Límite de sesiones**: Ilimitado
- **Almacenamiento**: Ilimitado
- **Funciones incluidas**:
  - Todas las funciones del Professional
  - IA avanzada para análisis de progreso
  - API personalizada completa
  - Integración con sistemas externos
  - Soporte prioritario 24/7 por teléfono
  - Cumplimiento HIPAA completo
  - Auditoría avanzada de accesos
  - Múltiples ubicaciones/clínicas
  - Gestión de equipo (hasta 5 usuarios)
  - Reportes personalizados
  - Integración con calendarios externos

---

## 🔐 **CONFIGURACIÓN DETALLADA EN CLERK DASHBOARD**

### **PLAN 1: STARTER PLAN**

**Configuración en Clerk:**

```
Name: Starter Plan
Key: starter_plan
Description: Perfecto para psicólogos que están comenzando su práctica profesional

Monthly base fee: €25.00
Annual discount - Monthly base fee: €20.00 (20% descuento)

Free trial: 14 Days

Publicly available: ✅ SÍ

Features:
- 25 pacientes máximo
- Sesiones ilimitadas
- 200MB almacenamiento optimizado
- Gestión básica de pacientes
- Sistema de citas
- Notas clínicas básicas
- Dashboard básico
- Soporte por email
```

**Metadata (en Advanced Settings):**
```json
{
  "patient_limit": 25,
  "session_limit": -1,
  "storage_limit": 200,
  "features": ["basic_patients", "basic_appointments", "basic_notes", "basic_dashboard"],
  "tier": "starter"
}
```

---

### **PLAN 2: PROFESSIONAL PLAN** ⭐ **MÁS POPULAR**

**Configuración en Clerk:**

```
Name: Professional Plan
Key: professional_plan
Description: ⭐ El plan más popular - Ideal para psicólogos establecidos con práctica en crecimiento

Monthly base fee: €55.00
Annual discount - Monthly base fee: €49.50 (10% descuento)

Free trial: 14 Days

Publicly available: ✅ SÍ

Features:
- 150 pacientes máximo
- Sesiones ilimitadas
- 1GB almacenamiento optimizado
- Todas las funciones del Starter
- Resúmenes con IA de las sesiones
- Reportes avanzados y analytics
- Análisis de tendencias de pacientes
- Exportación de datos completa
- Recordatorios automáticos (email + SMS)
- Integración con Stripe
- Facturación automática
- Dashboard avanzado con métricas
- Soporte prioritario por chat
- Backup automático
- Plantillas personalizables de notas
```

**Metadata (en Advanced Settings):**
```json
{
  "patient_limit": 150,
  "session_limit": -1,
  "storage_limit": 1000,
  "features": ["basic_patients", "basic_appointments", "basic_notes", "basic_dashboard", "ai_summaries", "advanced_reports", "analytics", "data_export", "auto_reminders", "stripe_integration", "auto_billing", "advanced_dashboard", "priority_support", "backup", "custom_templates"],
  "tier": "professional",
  "most_popular": true
}
```

---

### **PLAN 3: PREMIUM PLAN** 🚀 **EMPRESA**

**Configuración en Clerk:**

```
Name: Premium Plan
Key: premium_plan
Description: 🚀 Para clínicas grandes, equipos y profesionales que necesitan máxima funcionalidad

Monthly base fee: €150.00
Annual discount - Monthly base fee: €135.00 (10% descuento)

Free trial: 14 Days

Publicly available: ✅ SÍ

Features:
- Pacientes ilimitados
- Sesiones ilimitadas
- Almacenamiento ilimitado
- Todas las funciones del Professional
- IA avanzada para análisis de progreso
- API personalizada completa
- Integración con sistemas externos
- Soporte prioritario 24/7 por teléfono
- Cumplimiento HIPAA completo
- Auditoría avanzada de accesos
- Múltiples ubicaciones/clínicas
- Gestión de equipo (hasta 5 usuarios)
- Reportes personalizados
- Integración con calendarios externos
- Backup automático premium
```

**Metadata (en Advanced Settings):**
```json
{
  "patient_limit": -1,
  "session_limit": -1,
  "storage_limit": -1,
  "features": ["advanced_ai_analysis", "stripe_integration", "auto_billing", "custom_api", "external_integrations", "priority_support_24_7", "hipaa_compliance", "advanced_audit", "multi_location", "team_management", "custom_reports", "calendar_integration", "premium_backup"],
  "tier": "premium",
  "enterprise": true
}
```

---

## 📋 **PASOS PARA CONFIGURAR EN CLERK:**

### **1. Para cada plan:**
1. Haz clic en **"New Plan"**
2. Completa la información básica
3. En **"Features"**, añade cada característica como un bullet point
4. En **"Advanced Settings"** > **"Metadata"**, pega el JSON correspondiente
5. Guarda el plan

### **2. Configurar precios:**
- **Starter**: €25/mes, €20/mes anual
- **Professional**: €45/mes, €36/mes anual  
- **Premium**: €75/mes, €60/mes anual

### **3. Configurar trial:**
- Todos los planes: **14 días gratis**

---

## 🧪 **VERIFICAR CONFIGURACIÓN:**

Una vez configurados los planes, puedes verificar que funcionen:

1. **En tu app**: Los planes aparecerán en `/subscription`
2. **En el código**: Puedes verificar con:
```typescript
const { has } = await auth();

if (has({ plan: 'starter_plan' })) {
  // Lógica para Starter
} else if (has({ plan: 'professional_plan' })) {
  // Lógica para Professional  
} else if (has({ plan: 'premium_plan' })) {
  // Lógica para Premium
}
```

---

## 🔍 **VERIFICACIÓN DE LÍMITES EN EL CÓDIGO**

### **Verificar Plan del Usuario:**
```typescript
import { auth } from "@clerk/nextjs/server";

const { has } = await auth();

// Verificar plan específico
if (has({ plan: 'starter_plan' })) {
  // Lógica para Starter Plan
} else if (has({ plan: 'professional_plan' })) {
  // Lógica para Professional Plan
} else if (has({ plan: 'premium_plan' })) {
  // Lógica para Premium Plan
}

// Verificar funciones específicas
if (has({ feature: "advanced_reports" })) {
  // Mostrar reportes avanzados
}

if (has({ feature: "stripe_integration" })) {
  // Habilitar integración con Stripe
}
```

### **Verificar Límites de Pacientes y Sesiones:**
```typescript
// En las acciones del servidor
export const checkLimits = async () => {
  const { has } = await auth();
  
  let patientLimit = 0;
  let sessionLimit = 0;
  
  if (has({ plan: 'starter_plan' })) {
    patientLimit = 25;
    sessionLimit = -1; // Ilimitadas
  } else if (has({ plan: 'professional_plan' })) {
    patientLimit = 150;
    sessionLimit = -1; // Ilimitadas
  } else if (has({ plan: 'premium_plan' })) {
    patientLimit = -1; // Ilimitado
    sessionLimit = -1; // Ilimitadas
  }
  
  return { patientLimit, sessionLimit };
};

// Verificar si tiene IA para resúmenes
export const hasAISummaries = async () => {
  const { has } = await auth();
  return has({ feature: "ai_session_summaries" });
};

// Verificar si tiene IA avanzada
export const hasAdvancedAI = async () => {
  const { has } = await auth();
  return has({ feature: "advanced_ai_analysis" });
};
```

---

## 📊 **RESUMEN DE LÍMITES POR PLAN**

| Plan | Pacientes | Sesiones/Mes | Almacenamiento | IA Resúmenes | IA Avanzada | Funciones | Precio |
|------|-----------|--------------|----------------|--------------|-------------|-----------|--------|
| **Starter** | 25 | Ilimitadas | 200MB | ❌ | ❌ | Básicas | €25/mes |
| **Professional** ⭐ | 150 | Ilimitadas | 1GB | ✅ | ❌ | Avanzadas | €55/mes |
| **Premium** 🚀 | Ilimitado | Ilimitadas | Ilimitado | ✅ | ✅ | Completas | €150/mes |

### **🎯 Diferencias Clave:**
- **Starter**: Ideal para psicólogos nuevos con pocos pacientes
- **Professional**: Para psicólogos establecidos con IA para resúmenes automáticos
- **Premium**: Para clínicas grandes con IA avanzada para análisis de progreso

---

## 🚀 **PRÓXIMOS PASOS**

Una vez configurados los planes en Clerk:

1. ✅ **Configurar Supabase** - Ejecutar esquema SQL
2. ✅ **Probar autenticación** - Registro/login
3. ✅ **Verificar planes** - Página de suscripción
4. ✅ **Implementar límites** - En las acciones del servidor

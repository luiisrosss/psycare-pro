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

### 2. Professional Plan - €45/mes
- **Límite de pacientes**: 100
- **Límite de sesiones**: Ilimitadas
- **Almacenamiento**: 500MB (optimizado)
- **Funciones incluidas**:
  - Todas las funciones del Starter
  - Resúmenes con IA de las sesiones
  - Reportes avanzados
  - Análisis de tendencias
  - Exportación de datos
  - Recordatorios automáticos
  - Soporte prioritario

### 3. Premium Plan - €75/mes
- **Límite de pacientes**: Ilimitado
- **Límite de sesiones**: Ilimitado
- **Almacenamiento**: 1GB (optimizado)
- **Funciones incluidas**:
  - Todas las funciones del Professional
  - IA avanzada para análisis de progreso
  - Integración con Stripe
  - Facturación automática
  - API personalizada
  - Soporte prioritario 24/7
  - Backup automático
  - Cumplimiento HIPAA

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

### **PLAN 2: PROFESSIONAL PLAN**

**Configuración en Clerk:**

```
Name: Professional Plan
Key: professional_plan
Description: Ideal para psicólogos establecidos con práctica en crecimiento

Monthly base fee: €45.00
Annual discount - Monthly base fee: €36.00 (20% descuento)

Free trial: 14 Days

Publicly available: ✅ SÍ

Features:
- 100 pacientes máximo
- Sesiones ilimitadas
- 500MB almacenamiento optimizado
- Todas las funciones del Starter
- Resúmenes con IA de las sesiones
- Reportes avanzados
- Análisis de tendencias
- Exportación de datos
- Recordatorios automáticos
- Soporte prioritario
```

**Metadata (en Advanced Settings):**
```json
{
  "patient_limit": 100,
  "session_limit": -1,
  "storage_limit": 500,
  "features": ["ai_session_summaries", "advanced_reports", "trend_analysis", "data_export", "auto_reminders", "priority_support"],
  "tier": "professional"
}
```

---

### **PLAN 3: PREMIUM PLAN**

**Configuración en Clerk:**

```
Name: Premium Plan
Key: premium_plan
Description: Para prácticas grandes y profesionales que necesitan todas las funciones

Monthly base fee: €75.00
Annual discount - Monthly base fee: €60.00 (20% descuento)

Free trial: 14 Days

Publicly available: ✅ SÍ

Features:
- Pacientes ilimitados
- Sesiones ilimitadas
- 1GB almacenamiento optimizado
- Todas las funciones del Professional
- IA avanzada para análisis de progreso
- Integración con Stripe
- Facturación automática
- API personalizada
- Soporte prioritario 24/7
- Backup automático
- Cumplimiento HIPAA
```

**Metadata (en Advanced Settings):**
```json
{
  "patient_limit": -1,
  "session_limit": -1,
  "storage_limit": 1024,
  "features": ["advanced_ai_analysis", "stripe_integration", "auto_billing", "custom_api", "priority_support", "hipaa_compliance", "auto_backup"],
  "tier": "premium"
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
    sessionLimit = 100;
  } else if (has({ plan: 'professional_plan' })) {
    patientLimit = 100;
    sessionLimit = 500;
  } else if (has({ plan: 'premium_plan' })) {
    patientLimit = -1; // Ilimitado
    sessionLimit = -1; // Ilimitado
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

| Plan | Pacientes | Sesiones/Mes | Almacenamiento | IA Resúmenes | IA Avanzada | Funciones |
|------|-----------|--------------|----------------|--------------|-------------|-----------|
| **Starter** | 25 | Ilimitadas | 200MB | ❌ | ❌ | Básicas |
| **Professional** | 100 | Ilimitadas | 500MB | ✅ | ❌ | Avanzadas |
| **Premium** | Ilimitado | Ilimitado | 1GB | ✅ | ✅ | Todas |

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

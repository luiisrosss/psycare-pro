# 🔧 CONFIGURACIÓN DE PLANES DE SUSCRIPCIÓN EN CLERK

## 📋 **PLANES DE SUSCRIPCIÓN PARA PSYCARE PRO**

### **PLAN 1: STARTER PLAN**
```json
{
  "name": "Starter Plan",
  "key": "starter_plan",
  "description": "Plan competitivo para psicólogos en crecimiento",
  "monthlyBaseFee": 29.00,
  "annualDiscountMonthlyFee": 26.00,
  "currency": "EUR",
  "freeTrialDays": 14,
  "publiclyAvailable": true,
  "features": [
    "Hasta 50 pacientes",
    "1GB de almacenamiento",
    "Gestión básica de citas",
    "Notas clínicas básicas",
    "Gestión avanzada de clínicas",
    "Gestión avanzada de notas",
    "Soporte por email",
    "Backup básico",
    "Cumplimiento HIPAA completo"
  ],
  "metadata": {
    "patientLimit": 50,
    "storageLimitMB": 1024,
    "sessionLimit": "unlimited",
    "aiFeatures": false,
    "stripeIntegration": false,
    "advancedReports": false,
    "apiAccess": false,
    "teamManagement": false,
    "prioritySupport": false,
    "mostPopular": false,
    "targetAudience": "growing_psychologists"
  }
}
```

### **PLAN 2: PROFESSIONAL PLAN** ⭐ **MÁS POPULAR**
```json
{
  "name": "Professional Plan",
  "key": "professional_plan",
  "description": "⭐ El plan más popular - Ideal para psicólogos establecidos",
  "monthlyBaseFee": 59.00,
  "annualDiscountMonthlyFee": 53.00,
  "currency": "EUR",
  "freeTrialDays": 0,
  "publiclyAvailable": true,
  "features": [
    "Hasta 200 pacientes",
    "5GB de almacenamiento",
    "Sesiones ilimitadas",
    "IA para resúmenes de sesiones",
    "Reportes avanzados",
    "Soporte prioritario",
    "Backup automático",
    "Gestión avanzada de citas",
    "Notas clínicas avanzadas",
    "Integración con Google Calendar",
    "Cumplimiento HIPAA completo"
  ],
  "metadata": {
    "patientLimit": 200,
    "storageLimitMB": 5120,
    "sessionLimit": "unlimited",
    "aiFeatures": true,
    "stripeIntegration": false,
    "advancedReports": true,
    "apiAccess": false,
    "teamManagement": false,
    "prioritySupport": true,
    "mostPopular": true,
    "targetAudience": "established_psychologists"
  }
}
```

### **PLAN 3: ENTERPRISE PLAN** 🚀 **EMPRESA**
```json
{
  "name": "Enterprise Plan",
  "key": "enterprise_plan",
  "description": "🚀 Solución empresarial con almacenamiento casi ilimitado",
  "monthlyBaseFee": 149.00,
  "annualDiscountMonthlyFee": 134.00,
  "currency": "EUR",
  "freeTrialDays": 0,
  "publiclyAvailable": true,
  "features": [
    "Pacientes ilimitados",
    "50GB de almacenamiento",
    "Sesiones ilimitadas",
    "IA para resúmenes de sesiones",
    "Reportes avanzados",
    "Soporte prioritario",
    "Backup premium",
    "Gestión avanzada de citas",
    "Notas clínicas avanzadas",
    "Integración con Google Calendar",
    "Cumplimiento HIPAA completo"
  ],
  "metadata": {
    "patientLimit": "unlimited",
    "storageLimitMB": 51200,
    "sessionLimit": "unlimited",
    "aiFeatures": true,
    "stripeIntegration": false,
    "advancedReports": true,
    "apiAccess": false,
    "teamManagement": false,
    "prioritySupport": true,
    "mostPopular": false,
    "targetAudience": "large_clinics_teams"
  }
}
```

---

## 📊 **RESUMEN DE LÍMITES Y FUNCIONES**

| Característica | Starter | Professional | Enterprise |
|----------------|---------|--------------|------------|
| **Precio Mensual** | €29 | €59 | €149 |
| **Precio Anual** | €26/mes | €53/mes | €134/mes |
| **Pacientes** | 50 | 200 | Ilimitados |
| **Almacenamiento** | 1GB | 5GB | 50GB |
| **Sesiones** | Ilimitadas | Ilimitadas | Ilimitadas |
| **IA Resúmenes** | ❌ | ✅ | ✅ |
| **Reportes Avanzados** | ❌ | ✅ | ✅ |
| **Google Calendar** | ❌ | ✅ | ✅ |
| **Soporte** | Email | Prioritario | Prioritario |
| **Prueba Gratis** | 14 días | Sin prueba | Sin prueba |
| **HIPAA** | ✅ | ✅ | ✅ |

---

## 🎯 **ESTRATEGIA DE CONVERSIÓN**

### **DISTRIBUCIÓN ESPERADA:**
- **30%** Starter (€29) - Psicólogos en crecimiento
- **55%** Professional (€59) - **PLAN OBJETIVO** ⭐
- **15%** Enterprise (€149) - Clínicas y equipos grandes

### **PSICOLOGÍA DE PRECIOS:**
- **Starter**: Precio competitivo para atraer
- **Professional**: Mejor valor/precio (MÁS POPULAR)
- **Enterprise**: Almacenamiento casi ilimitado para empresas

---

## 🔐 **CONFIGURACIÓN DETALLADA EN CLERK DASHBOARD**

### **PLAN 1: STARTER PLAN**

**Configuración en Clerk:**

```
Name: Starter Plan
Key: starter_plan
Description: Plan competitivo para psicólogos en crecimiento

Monthly base fee: €29.00
Annual discount - Monthly base fee: €26.00 (10% descuento)

Free trial: 14 Days

Publicly available: ✅ SÍ

Features:
- Hasta 50 pacientes
- 1GB de almacenamiento
- Gestión básica de citas
- Notas clínicas básicas
- Gestión avanzada de clínicas
- Gestión avanzada de notas
- Soporte por email
- Backup básico
- Cumplimiento HIPAA completo
```

**Metadata (en Advanced Settings):**
```json
{
  "patientLimit": 50,
  "storageLimitMB": 1024,
  "sessionLimit": "unlimited",
  "aiFeatures": false,
  "stripeIntegration": false,
  "advancedReports": false,
  "apiAccess": false,
  "teamManagement": false,
  "prioritySupport": false,
  "mostPopular": false,
  "targetAudience": "growing_psychologists"
}
```

---

### **PLAN 2: PROFESSIONAL PLAN** ⭐ **MÁS POPULAR**

**Configuración en Clerk:**

```
Name: Professional Plan
Key: professional_plan
Description: ⭐ El plan más popular - Ideal para psicólogos establecidos

Monthly base fee: €59.00
Annual discount - Monthly base fee: €53.00 (10% descuento)

Free trial: 0 Days

Publicly available: ✅ SÍ

Features:
- Hasta 200 pacientes
- 5GB de almacenamiento
- Sesiones ilimitadas
- IA para resúmenes de sesiones
- Reportes avanzados
- Soporte prioritario
- Backup automático
- Gestión avanzada de citas
- Notas clínicas avanzadas
- Integración con Google Calendar
- Cumplimiento HIPAA completo
```

**Metadata (en Advanced Settings):**
```json
{
  "patientLimit": 200,
  "storageLimitMB": 5120,
  "sessionLimit": "unlimited",
  "aiFeatures": true,
  "stripeIntegration": false,
  "advancedReports": true,
  "apiAccess": false,
  "teamManagement": false,
  "prioritySupport": true,
  "mostPopular": true,
  "targetAudience": "established_psychologists"
}
```

---

### **PLAN 3: ENTERPRISE PLAN** 🚀 **EMPRESA**

**Configuración en Clerk:**

```
Name: Enterprise Plan
Key: enterprise_plan
Description: 🚀 Solución empresarial con almacenamiento casi ilimitado

Monthly base fee: €149.00
Annual discount - Monthly base fee: €134.00 (10% descuento)

Free trial: 0 Days

Publicly available: ✅ SÍ

Features:
- Pacientes ilimitados
- 50GB de almacenamiento
- Sesiones ilimitadas
- IA para resúmenes de sesiones
- Reportes avanzados
- Soporte prioritario
- Backup premium
- Gestión avanzada de citas
- Notas clínicas avanzadas
- Integración con Google Calendar
- Cumplimiento HIPAA completo
```

**Metadata (en Advanced Settings):**
```json
{
  "patientLimit": "unlimited",
  "storageLimitMB": 51200,
  "sessionLimit": "unlimited",
  "aiFeatures": true,
  "stripeIntegration": false,
  "advancedReports": true,
  "apiAccess": false,
  "teamManagement": false,
  "prioritySupport": true,
  "mostPopular": false,
  "targetAudience": "large_clinics_teams"
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
- **Starter**: €29/mes, €26/mes anual
- **Professional**: €59/mes, €53/mes anual  
- **Enterprise**: €149/mes, €134/mes anual

### **3. Configurar trial:**
- **Starter**: 14 días gratis
- **Professional**: Sin prueba gratis
- **Enterprise**: Sin prueba gratis

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
} else if (has({ plan: 'enterprise_plan' })) {
  // Lógica para Enterprise
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
} else if (has({ plan: 'enterprise_plan' })) {
  // Lógica para Enterprise Plan
}

// Verificar funciones específicas
if (has({ feature: "advanced_reports" })) {
  // Mostrar reportes avanzados
}

if (has({ feature: "google_calendar" })) {
  // Habilitar integración con Google Calendar
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
    patientLimit = 50;
    sessionLimit = -1; // Ilimitadas
  } else if (has({ plan: 'professional_plan' })) {
    patientLimit = 200;
    sessionLimit = -1; // Ilimitadas
  } else if (has({ plan: 'enterprise_plan' })) {
    patientLimit = -1; // Ilimitado
    sessionLimit = -1; // Ilimitadas
  }
  
  return { patientLimit, sessionLimit };
};

// Verificar si tiene IA para resúmenes
export const hasAISummaries = async () => {
  const { has } = await auth();
  return has({ plan: 'professional_plan' }) || has({ plan: 'enterprise_plan' });
};

// Verificar si tiene reportes avanzados
export const hasAdvancedReports = async () => {
  const { has } = await auth();
  return has({ plan: 'professional_plan' }) || has({ plan: 'enterprise_plan' });
};

// Verificar si tiene Google Calendar
export const hasGoogleCalendar = async () => {
  const { has } = await auth();
  return has({ plan: 'professional_plan' }) || has({ plan: 'enterprise_plan' });
};
```

---

## 💻 **CÓDIGO TYPESCRIPT PARA VERIFICACIÓN DE LÍMITES**

```typescript
interface PlanLimits {
  patientLimit: number | 'unlimited';
  storageLimitMB: number;
  sessionLimit: 'unlimited';
  aiFeatures: boolean;
  advancedReports: boolean;
  googleCalendar: boolean;
  hipaaCompliance: boolean;
}

const planLimits: Record<string, PlanLimits> = {
  starter_plan: {
    patientLimit: 50,
    storageLimitMB: 1024,
    sessionLimit: 'unlimited',
    aiFeatures: false,
    advancedReports: false,
    googleCalendar: false,
    hipaaCompliance: true
  },
  professional_plan: {
    patientLimit: 200,
    storageLimitMB: 5120,
    sessionLimit: 'unlimited',
    aiFeatures: true,
    advancedReports: true,
    googleCalendar: true,
    hipaaCompliance: true
  },
  enterprise_plan: {
    patientLimit: 'unlimited',
    storageLimitMB: 51200,
    sessionLimit: 'unlimited',
    aiFeatures: true,
    advancedReports: true,
    googleCalendar: true,
    hipaaCompliance: true
  }
};

export function checkLimits(planKey: string, currentUsage: {
  patients: number;
  storageMB: number;
  sessions: number;
}): { canAdd: boolean; reason?: string } {
  const limits = planLimits[planKey];
  if (!limits) return { canAdd: false, reason: 'Plan no válido' };

  // Verificar límite de pacientes
  if (limits.patientLimit !== 'unlimited' && 
      currentUsage.patients >= limits.patientLimit) {
    return { canAdd: false, reason: 'Límite de pacientes alcanzado' };
  }

  // Verificar límite de almacenamiento
  if (currentUsage.storageMB >= limits.storageLimitMB) {
    return { canAdd: false, reason: 'Límite de almacenamiento alcanzado' };
  }

  return { canAdd: true };
}
```

---

## 🚀 **PRÓXIMOS PASOS**

Una vez configurados los planes en Clerk:

1. ✅ **Configurar Supabase** - Ejecutar esquema SQL
2. ✅ **Probar autenticación** - Registro/login
3. ✅ **Verificar planes** - Página de suscripción
4. ✅ **Implementar límites** - En las acciones del servidor
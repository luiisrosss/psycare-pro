# Configuración de Planes de Suscripción en Clerk

## Planes para PsyCare Pro

### 1. Starter Plan - $19/mes
- **Límite de pacientes**: 25
- **Almacenamiento**: 2GB
- **Funciones incluidas**:
  - Gestión básica de pacientes
  - Sistema de citas
  - Notas clínicas básicas
  - Dashboard básico

### 2. Professional Plan - $39/mes
- **Límite de pacientes**: 100
- **Almacenamiento**: 10GB
- **Funciones incluidas**:
  - Todas las funciones del Starter
  - Reportes avanzados
  - Análisis de tendencias
  - Exportación de datos
  - Recordatorios automáticos

### 3. Premium Plan - $69/mes
- **Límite de pacientes**: Ilimitado
- **Almacenamiento**: 50GB
- **Funciones incluidas**:
  - Todas las funciones del Professional
  - Integración con Stripe
  - Facturación automática
  - API personalizada
  - Soporte prioritario

## Configuración en Clerk Dashboard

1. Ve a [Clerk Dashboard](https://dashboard.clerk.com/)
2. Selecciona tu aplicación
3. Ve a "Subscriptions" en el menú lateral
4. Crea los siguientes planes:

### Starter Plan
```json
{
  "name": "Starter",
  "description": "Perfecto para psicólogos que están comenzando",
  "price": {
    "amount": 1900,
    "currency": "usd",
    "interval": "month"
  },
  "features": [
    "25 pacientes",
    "2GB almacenamiento",
    "Gestión básica de pacientes",
    "Sistema de citas",
    "Notas clínicas básicas",
    "Dashboard básico"
  ],
  "metadata": {
    "patient_limit": 25,
    "storage_limit": 2147483648,
    "features": ["basic_patients", "basic_appointments", "basic_notes", "basic_dashboard"]
  }
}
```

### Professional Plan
```json
{
  "name": "Professional",
  "description": "Ideal para psicólogos establecidos",
  "price": {
    "amount": 3900,
    "currency": "usd",
    "interval": "month"
  },
  "features": [
    "100 pacientes",
    "10GB almacenamiento",
    "Reportes avanzados",
    "Análisis de tendencias",
    "Exportación de datos",
    "Recordatorios automáticos"
  ],
  "metadata": {
    "patient_limit": 100,
    "storage_limit": 10737418240,
    "features": ["advanced_reports", "trend_analysis", "data_export", "auto_reminders"]
  }
}
```

### Premium Plan
```json
{
  "name": "Premium",
  "description": "Para prácticas grandes y profesionales",
  "price": {
    "amount": 6900,
    "currency": "usd",
    "interval": "month"
  },
  "features": [
    "Pacientes ilimitados",
    "50GB almacenamiento",
    "Integración con Stripe",
    "Facturación automática",
    "API personalizada",
    "Soporte prioritario"
  ],
  "metadata": {
    "patient_limit": -1,
    "storage_limit": 53687091200,
    "features": ["stripe_integration", "auto_billing", "custom_api", "priority_support"]
  }
}
```

## Verificación de Planes en el Código

En las acciones del servidor, puedes verificar el plan del usuario usando:

```typescript
import { auth } from "@clerk/nextjs/server";

const { has } = await auth();

// Verificar si tiene plan Premium
if (has({ plan: 'premium' })) {
  // Funciones ilimitadas
}

// Verificar límites específicos
if (has({ feature: "advanced_reports" })) {
  // Mostrar reportes avanzados
}
```

## Límites por Plan

### Starter Plan
- Máximo 25 pacientes
- Máximo 2GB de almacenamiento
- Solo funciones básicas

### Professional Plan
- Máximo 100 pacientes
- Máximo 10GB de almacenamiento
- Funciones avanzadas incluidas

### Premium Plan
- Pacientes ilimitados
- Máximo 50GB de almacenamiento
- Todas las funciones incluidas

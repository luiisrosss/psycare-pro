<div align="center">
  <br />
  <div className="flex items-center justify-center mb-4">
    <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    </div>
  </div>

  <div>
    <img src="https://img.shields.io/badge/-Next.JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=black" alt="next.js" />
    <img src="https://img.shields.io/badge/-Supabase-green?style=for-the-badge&logoColor=white&logo=supabase&color=green" alt="supabase" />
    <img src="https://img.shields.io/badge/-Tailwind-00BCFF?style=for-the-badge&logo=tailwind-css&logoColor=white" />
    <img src="https://img.shields.io/badge/-Clerk-blue?style=for-the-badge&logoColor=white&logo=clerk&color=blue" />
  </div>

  <h3 align="center">PsyCare Pro - Sistema de Gestión Clínica para Psicólogos</h3>

   <div align="center">
     Una plataforma SaaS completa para psicólogos autónomos que necesitan gestionar pacientes, citas, notas clínicas y facturación de manera profesional y segura.
    </div>
</div>

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 🔗 [Assets](#links)
6. 🚀 [More](#more)

## 🚀 **Desarrollo Profesional**

Este proyecto está diseñado para ser una solución SaaS completa y profesional para psicólogos autónomos. Cada componente ha sido cuidadosamente planificado para cumplir con los estándares de la industria médica y las mejores prácticas de desarrollo.

## <a name="introduction">🤖 Introduction</a>

**PsyCare Pro** es un sistema de gestión clínica completo diseñado específicamente para psicólogos autónomos. La plataforma ofrece todas las herramientas necesarias para gestionar una práctica psicológica de manera profesional, eficiente y segura.

### 🎯 **Características Principales**

- **Gestión Completa de Pacientes**: Registro, historial médico, información de contacto de emergencia
- **Sistema de Citas Avanzado**: Calendario interactivo, tipos de sesión, recordatorios automáticos
- **Notas Clínicas Seguras**: Editor avanzado con plantillas, evaluación de riesgo, seguimiento de progreso
- **Facturación Automática**: Generación de facturas, seguimiento de pagos, reportes financieros
- **Dashboard Profesional**: Métricas en tiempo real, estadísticas de práctica, análisis de tendencias
- **Seguridad HIPAA**: Encriptación de datos, Row Level Security, auditoría de accesos
- **Suscripciones Flexibles**: 3 planes adaptados a diferentes necesidades de práctica

## <a name="tech-stack">⚙️ Tech Stack</a>

- **[Next.js 15](https://nextjs.org/)** - Framework React de última generación con App Router, Server Components y optimizaciones de rendimiento para aplicaciones web modernas.

- **[Supabase](https://supabase.com/)** - Backend-as-a-Service que proporciona base de datos PostgreSQL, autenticación, almacenamiento y APIs en tiempo real con Row Level Security para máxima seguridad.

- **[Clerk](https://clerk.com/)** - Plataforma de autenticación y gestión de usuarios que simplifica el registro, login, verificación de email y gestión de sesiones seguras.

- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first que permite crear interfaces de usuario personalizadas y responsivas con clases de bajo nivel.

- **[shadcn/ui](https://ui.shadcn.com/)** - Biblioteca de componentes construida sobre Radix UI y Tailwind CSS, ofreciendo un sistema de diseño moderno y accesible.

- **[TypeScript](https://www.typescriptlang.org/)** - Superset de JavaScript que añade tipado estático, mejorando la calidad del código y la detección de errores durante el desarrollo.

- **[Stripe](https://stripe.com/)** - Plataforma de pagos que maneja facturación, suscripciones y procesamiento de pagos de manera segura y confiable.

- **[Zod](https://zod.dev/)** - Biblioteca de validación de esquemas TypeScript-first que asegura la integridad de los datos validando estructuras en tiempo de desarrollo.

## <a name="features">🔋 Features</a>

### 🔐 **Sistema de Autenticación Completo**
- Registro/Login con email y contraseña
- Verificación de email automática
- Reset de contraseña por email
- Login social (Google)
- Protección de rutas automática
- Gestión de sesiones segura

### 💳 **Sistema de Suscripciones**
- **Starter ($19/mes)**: 25 pacientes, 2GB almacenamiento
- **Professional ($39/mes)**: 100 pacientes, 10GB, reportes avanzados
- **Premium ($69/mes)**: Ilimitado, 50GB, todas las funciones
- Integración completa con Stripe
- Customer Portal para gestión de suscripciones
- Upgrades/downgrades automáticos

### 🏠 **Dashboard Profesional**
- Panel principal con métricas clave
- Estadísticas en tiempo real (pacientes, citas, ingresos)
- Acciones rápidas (nuevo paciente, nueva cita)
- Vista general de próximas citas
- Resumen semanal de actividad

### 👥 **Gestión Completa de Pacientes**
- CRUD completo de pacientes
- Información personal y médica completa
- Búsqueda avanzada por nombre, email, teléfono
- Filtros por estado (activo, inactivo, dado de alta)
- Estados visuales con colores profesionales
- Archivado de pacientes dados de alta

### 📅 **Sistema de Citas Interactivo**
- Calendario avanzado con vista semanal y mensual
- Gestión de citas con tipos de sesión flexibles
- Estados de citas (Programada, Completada, Cancelada, No asistió)
- Recordatorios automáticos (email/SMS)
- Estadísticas de citas en tiempo real

### 📝 **Sistema de Notas Clínicas**
- Editor avanzado de notas de sesión
- Plantillas personalizables por tipo de sesión
- Seguimiento del progreso del paciente
- Evaluaciones estructuradas (estado de ánimo, riesgo, crisis)
- Encriptación de datos sensibles
- Búsqueda en notas por paciente/fecha

### 💰 **Sistema de Facturación**
- Facturación automática por sesiones
- Gestión de pagos (pendiente, pagado, vencido)
- Generación automática de recibos
- Reportes financieros (ingresos, tendencias)
- Números de factura automáticos

### 🔒 **Seguridad y Privacidad**
- Row Level Security (RLS) en base de datos
- Aislamiento total de datos entre psicólogos
- Encriptación de datos médicos sensibles
- Cumplimiento HIPAA para datos médicos
- Backup automático de datos
- Auditoría de accesos

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/adrianhajdin/saas-app.git
cd saas-app
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env.local` in the root of your project and add the following content:

```env
# Clerk - Autenticación
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Supabase - Base de datos
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe - Pagos (opcional para facturación)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Configuración de la aplicación
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Sentry (opcional - para monitoreo de errores)
SENTRY_AUTH_TOKEN=
```

**Configuración de Servicios Externos:**

1. **[Supabase](https://supabase.com/dashboard)** - Crear proyecto y ejecutar el esquema SQL
2. **[Clerk](https://clerk.com/)** - Configurar autenticación y planes de suscripción
3. **[Stripe](https://stripe.com/)** - Configurar pagos y facturación (opcional)
4. **[Vercel](https://vercel.com/)** - Para deploy en producción (opcional)

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

## <a name="links">🔗 Recursos</a>

### **Documentación del Proyecto**
- [Plan de Desarrollo Detallado](./PLAN_SAAS_CLINICO.md)
- [Esquema de Base de Datos](./database-schema.sql)
- [Variables de Entorno](./env.example)

### **Tecnologías Utilizadas**
- [Next.js 15](https://nextjs.org/docs) - Framework React
- [Supabase](https://supabase.com/docs) - Backend y Base de Datos
- [Clerk](https://clerk.com/docs) - Autenticación
- [Tailwind CSS](https://tailwindcss.com/docs) - Estilos
- [shadcn/ui](https://ui.shadcn.com/docs) - Componentes UI

## <a name="more">🚀 Próximos Pasos</a>

### **Configuración Inicial**
1. Configurar Supabase y ejecutar el esquema SQL
2. Configurar Clerk para autenticación
3. Configurar Stripe para pagos (opcional)
4. Ejecutar `npm install` y `npm run dev`

### **Desarrollo Continuo**
- Implementar gestión de pacientes
- Desarrollar sistema de citas
- Crear editor de notas clínicas
- Implementar sistema de facturación
- Añadir reportes y analytics
#   p s y c a r e - p r o 
 
 
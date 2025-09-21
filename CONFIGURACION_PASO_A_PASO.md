# 🚀 CONFIGURACIÓN COMPLETA - PSYCARE PRO

## 📋 **PASO 1: CONFIGURAR CLERK (SOLO AUTENTICACIÓN)**

### **1.1 Crear aplicación en Clerk:**
1. Ve a: https://clerk.com/dashboard
2. Crea una nueva aplicación (SIN billing)
3. Configura dominios:
   - Development: `localhost:3000`
   - Production: Tu dominio

### **1.2 Obtener claves de Clerk:**
- Publishable Key: `pk_test_...`
- Secret Key: `sk_test_...`

**NOTA:** No configures billing en Clerk, usaremos Stripe directamente.

---

## 📋 **PASO 2: CONFIGURAR SUPABASE (BASE DE DATOS)**

### **2.1 Crear proyecto en Supabase:**
1. Ve a: https://supabase.com/dashboard
2. Crea un nuevo proyecto
3. Espera 2-3 minutos

### **2.2 Ejecutar esquema SQL:**
1. Ve a SQL Editor en Supabase
2. Copia y pega TODO el contenido de `database-schema-fixed.sql`
3. Ejecuta el script

### **2.3 Ejecutar script adicional de suscripciones:**
1. En el mismo SQL Editor de Supabase
2. Copia y pega TODO el contenido de `database-subscriptions-addon.sql`
3. Ejecuta el script

### **2.3 Obtener claves de Supabase:**
- Project URL: `https://your-project.supabase.co`
- Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 📋 **PASO 3: CONFIGURAR STRIPE (SUSCRIPCIONES EN EUROS)**

### **3.1 Crear cuenta en Stripe:**
1. Ve a: https://stripe.com
2. Crea una cuenta
3. Activa el modo de prueba

### **3.2 Configurar productos y precios:**
**IMPORTANTE:** Los precios están en EUROS (€)

#### **PLAN STARTER (€29/mes):**
- Producto: "Starter Plan"
- Precio mensual: €29.00
- Precio anual: €26.00/mes (€312/año)

#### **PLAN PROFESSIONAL (€59/mes):**
- Producto: "Professional Plan" 
- Precio mensual: €59.00
- Precio anual: €53.00/mes (€636/año)

#### **PLAN ENTERPRISE (€149/mes):**
- Producto: "Enterprise Plan"
- Precio mensual: €149.00
- Precio anual: €134.00/mes (€1608/año)

### **3.3 Obtener claves de Stripe:**
- Secret Key: `sk_test_...`
- Publishable Key: `pk_test_...`
- Webhook Secret: `whsec_...`

### **3.4 Configurar webhooks:**
- Endpoint: `https://tu-dominio.com/api/webhooks/stripe`
- Eventos: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`

---

## 📋 **PASO 4: CONFIGURAR VARIABLES DE ENTORNO**

Crea el archivo `.env.local` en la raíz del proyecto:

```env
# Clerk - Autenticación
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_tu_clave_aqui
CLERK_SECRET_KEY=sk_test_tu_clave_aqui
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Supabase - Base de datos
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe - Pagos
STRIPE_SECRET_KEY=sk_test_tu_clave_aqui
STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_aqui
STRIPE_WEBHOOK_SECRET=whsec_tu_clave_aqui

# Configuración de la aplicación
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📋 **PASO 5: VERIFICAR CONFIGURACIÓN**

### **5.1 Reiniciar servidor:**
```bash
npm run dev
```

### **5.2 Probar funcionalidades:**
1. **Autenticación**: Registro/login
2. **Suscripciones**: Página `/subscription`
3. **Dashboard**: Métricas y datos
4. **Pacientes**: CRUD completo
5. **Citas**: Calendario y gestión
6. **Notas**: Editor y búsqueda
7. **Facturación**: Crear y gestionar facturas

---

## 🚨 **PROBLEMAS COMUNES Y SOLUCIONES**

### **Error de Clerk:**
- Verifica que las claves sean correctas
- Asegúrate de que el dominio esté configurado

### **Error de Supabase:**
- Verifica que el esquema SQL se ejecutó completamente
- Revisa las políticas RLS

### **Error de Stripe:**
- Verifica que las claves sean de modo prueba
- Configura los webhooks correctamente

---

## 🎯 **PRÓXIMOS PASOS DESPUÉS DE LA CONFIGURACIÓN**

1. **Probar todas las funcionalidades**
2. **Configurar datos de ejemplo**
3. **Optimizar rendimiento**
4. **Preparar para producción**
5. **Configurar dominio y SSL**

---

## 📞 **SOPORTE**

Si tienes problemas:
1. Revisa los logs de la consola
2. Verifica las variables de entorno
3. Comprueba la configuración de cada servicio
4. Consulta la documentación oficial de cada plataforma

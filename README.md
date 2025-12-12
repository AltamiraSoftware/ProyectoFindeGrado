# 🏥 Sistema de Gestión de Clínica de Psicología

## 📋 Descripción del Proyecto

Sistema web completo desarrollado como Trabajo de Fin de Grado (TFG) para la gestión integral de una clínica de psicología. La aplicación permite a los profesionales gestionar sus citas, disponibilidad, servicios y comunicación con los clientes, mientras que los clientes pueden reservar citas, realizar pagos seguros y comunicarse directamente con su profesional.

### 🌐 Demo en Vivo

**URL de Producción:** [https://altamirasoftware.vercel.app](https://altamirasoftware.vercel.app)

---

## ✨ Características Principales

### Para Profesionales
- 📅 **Gestión de Citas**: Calendario interactivo con visualización de todas las citas programadas
- ⏰ **Gestión de Disponibilidad**: Sistema flexible para definir horarios disponibles semana a semana
- 👥 **Gestión de Clientes**: Creación y administración de perfiles de pacientes
- 💼 **Gestión de Servicios**: Administración de servicios ofrecidos con precios personalizables
- 💬 **Sistema de Chat**: Comunicación directa con clientes en tiempo real
- 📊 **Resumen Semanal**: Vista consolidada de la semana con estadísticas de citas
- 📧 **Automatización de Emails**: Envío automático de recordatorios y confirmaciones

### Para Clientes
- 🔐 **Autenticación Segura**: Sistema de registro e inicio de sesión
- 📅 **Reserva de Citas**: Interfaz intuitiva para seleccionar fecha, hora y servicio
- 💳 **Pagos Seguros**: Integración con Stripe para procesamiento de pagos
- 📱 **Panel de Cliente**: Dashboard personalizado con próximas citas y historial
- 💬 **Chat con Profesional**: Comunicación directa con el profesional asignado
- 🎥 **Videollamadas**: Integración con Daily.co para sesiones online
- ⚙️ **Configuración de Cuenta**: Gestión de perfil y datos personales

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 16** - Framework React con App Router
- **React 19** - Biblioteca de interfaz de usuario
- **Tailwind CSS 4** - Framework de estilos utility-first
- **FullCalendar** - Componente de calendario interactivo
- **Heroicons** - Iconos SVG optimizados
- **Lucide React** - Biblioteca de iconos adicionales
- **date-fns** - Utilidades para manipulación de fechas

### Backend & Servicios
- **Supabase** - Backend como servicio (BaaS)
  - Autenticación y autorización
  - Base de datos PostgreSQL
  - Almacenamiento de datos en tiempo real
- **Stripe** - Pasarela de pagos
- **Daily.co** - Plataforma de videollamadas
- **Resend** - Servicio de envío de emails transaccionales

### Herramientas de Desarrollo
- **ESLint** - Linter para JavaScript/TypeScript
- **Git** - Control de versiones
- **Vercel** - Plataforma de despliegue y hosting

---

## 📁 Estructura del Proyecto

```
gestor-clinica/
├── app/                      # Rutas y páginas (App Router de Next.js)
│   ├── api/                  # API Routes
│   │   ├── admin/            # Endpoints administrativos
│   │   ├── citas/            # Gestión de citas
│   │   ├── cliente/          # Endpoints para clientes
│   │   ├── email/            # Envío de emails
│   │   ├── stripe/           # Integración de pagos
│   │   ├── video/            # Creación de salas de videollamada
│   │   └── webhooks/         # Webhooks de Stripe
│   ├── auth/                 # Páginas de autenticación
│   │   ├── login/
│   │   └── register/
│   ├── cliente/              # Dashboard del cliente
│   ├── dashboard/            # Dashboard del profesional
│   │   ├── chat/            # Sistema de chat
│   │   └── disponibilidad/  # Gestión de disponibilidad
│   ├── layout.js            # Layout principal
│   ├── page.js              # Página de inicio
│   └── globals.css          # Estilos globales
├── components/              # Componentes reutilizables
│   ├── ClienteDash/        # Componentes del dashboard cliente
│   ├── chat/               # Componentes de chat
│   ├── layout/             # Componentes de layout (header, footer, etc.)
│   └── Modal/              # Modales de la aplicación
├── hooks/                  # Custom React Hooks
│   ├── useAuthModal.js
│   ├── useChat.js
│   └── useUser.js
├── lib/                    # Utilidades y configuraciones
│   ├── supabaseClient.js   # Cliente de Supabase
│   ├── supabaseAdmin.js    # Cliente admin de Supabase
│   ├── stripe.js           # Configuración de Stripe
│   ├── resendClient.js     # Cliente de Resend
│   └── getBaseUrl.js       # Utilidad para URLs
├── public/                 # Archivos estáticos
└── package.json            # Dependencias del proyecto
```

---

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js 18+ y npm
- Cuenta de Supabase
- Cuenta de Stripe
- Cuenta de Daily.co (opcional, para videollamadas)
- Cuenta de Resend (opcional, para emails)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd gestor-clinica
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_de_supabase

# Stripe
STRIPE_SECRET_KEY=tu_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu_stripe_publishable_key

# Daily.co (opcional)
DAILY_API_KEY=tu_daily_api_key

# Resend (opcional)
RESEND_API_KEY=tu_resend_api_key

# URL Base
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. **Configurar la base de datos en Supabase**

Ejecutar los scripts SQL necesarios para crear las tablas:
- `clientes`
- `citas`
- `servicios`
- `franjas_disponibilidad`
- `mensajes` (para el chat)
- Y otras tablas relacionadas según el esquema del proyecto

5. **Ejecutar el servidor de desarrollo**
```bash
npm run dev
```

6. **Abrir en el navegador**
```
http://localhost:3000
```

---

## 📖 Funcionalidades Detalladas

### Sistema de Autenticación
- Registro de usuarios (profesionales y clientes)
- Inicio de sesión seguro
- Gestión de sesiones con Supabase Auth
- Protección de rutas según rol de usuario

### Gestión de Citas
- Creación de citas desde el dashboard profesional
- Reserva de citas por parte de los clientes
- Visualización en calendario interactivo
- Cancelación y modificación de citas
- Notificaciones automáticas por email

### Sistema de Pagos
- Integración completa con Stripe
- Checkout seguro para clientes
- Webhooks para actualización de estado de pagos
- Historial de transacciones

### Comunicación
- Chat en tiempo real entre profesional y cliente
- Sistema de mensajería persistente
- Notificaciones de nuevos mensajes

### Videollamadas
- Creación automática de salas de videollamada
- Integración con Daily.co
- Acceso directo desde las citas programadas

---

## 🎯 Casos de Uso

### Flujo del Profesional
1. Registro/Inicio de sesión como profesional
2. Configuración de disponibilidad semanal
3. Gestión de servicios ofrecidos
4. Visualización y gestión de citas en el calendario
5. Comunicación con clientes a través del chat
6. Revisión de resumen semanal

### Flujo del Cliente
1. Registro/Inicio de sesión como cliente
2. Navegación al dashboard de cliente
3. Selección de fecha y hora disponible
4. Selección de servicio y confirmación
5. Proceso de pago seguro con Stripe
6. Recepción de confirmación por email
7. Comunicación con el profesional
8. Acceso a videollamada el día de la cita

---

## 🔒 Seguridad

- Autenticación y autorización mediante Supabase Auth
- Protección de rutas según roles de usuario
- Variables de entorno para datos sensibles
- Validación de datos en cliente y servidor
- Pagos seguros mediante Stripe (PCI DSS compliant)
- Encriptación de datos en tránsito (HTTPS)

---

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- 💻 Escritorio
- 📱 Tablets
- 📱 Dispositivos móviles

Utilizando Tailwind CSS para un diseño responsive y moderno.

---

## 🚢 Despliegue

El proyecto está desplegado en **Vercel** y accesible en:
**https://altamirasoftware.vercel.app**

### Proceso de Despliegue
1. Conectar repositorio Git con Vercel
2. Configurar variables de entorno en el dashboard de Vercel
3. Despliegue automático en cada push a la rama principal

---

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Producción
npm run build        # Construye la aplicación para producción
npm run start        # Inicia el servidor de producción

# Linting
npm run lint         # Ejecuta ESLint
```

---

## 🎓 Información del TFG

Este proyecto ha sido desarrollado como Trabajo intermoludar (TFG) para el Grado Superior de Desarrollo de Aplicaciones.

### Objetivos del Proyecto
- Desarrollar una solución completa de gestión para clínicas de psicología
- Implementar tecnologías modernas de desarrollo web
- Integrar servicios de terceros (pagos, videollamadas, emails)
- Crear una experiencia de usuario intuitiva y profesional

### Tecnologías Aprendidas
- Desarrollo full-stack con Next.js
- Gestión de bases de datos con Supabase
- Integración de APIs de terceros
- Diseño responsive con Tailwind CSS
- Autenticación y autorización
- Procesamiento de pagos online

---

## 📄 Licencia

Este proyecto es de uso educativo y ha sido desarrollado como parte de un Trabajo de Fin de Grado.

---

## 👤 Autor

Desarrollado como proyecto de TFG para Grado Superior.

---

## 🙏 Agradecimientos

- **Supabase** - Por la plataforma de backend
- **Vercel** - Por el hosting y despliegue
- **Stripe** - Por la solución de pagos
- **Daily.co** - Por la plataforma de videollamadas
- **Next.js** - Por el framework de desarrollo

---

## 📞 Contacto

Para más información sobre este proyecto, contactar a través del repositorio o la aplicación en producción.

---

**Última actualización:** 2025

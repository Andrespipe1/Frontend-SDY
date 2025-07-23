# 🩺 SALUDIFY - Plataforma Integral de Nutrición y Salud

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-6.3.1-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.5-38B2AC?style=for-the-badge&logo=tailwind-css)
![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=for-the-badge&logo=node.js)
![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=for-the-badge)

**Sistema de monitoreo de salud integral para nutricionistas y pacientes**

</div>

---

## 📋 Tabla de Contenidos

- [🎯 Descripción del Proyecto](#-descripción-del-proyecto)
- [✨ Características Principales](#-características-principales)
- [🛠️ Stack Tecnológico](#️-stack-tecnológico)
- [🏗️ Arquitectura del Sistema](#️-arquitectura-del-sistema)
- [📱 Funcionalidades por Rol](#-funcionalidades-por-rol)
- [🚀 Instalación y Configuración](#-instalación-y-configuración)
- [⚙️ Configuración de Variables de Entorno](#️-configuración-de-variables-de-entorno)
- [📦 Scripts Disponibles](#-scripts-disponibles)
- [🌐 Despliegue](#-despliegue)
- [🧪 Testing](#-testing)
- [📊 API Endpoints](#-api-endpoints)
- [🔒 Seguridad](#-seguridad)
- [👨‍💻 Autores](#-autores)

---

## 🎯 Descripción del Proyecto

**SALUDIFY** es una plataforma web moderna y completa diseñada para revolucionar la gestión nutricional. El sistema facilita la comunicación entre nutricionistas y pacientes, proporcionando herramientas avanzadas para el seguimiento de la salud, generación de recomendaciones personalizadas mediante IA, y gestión integral de citas médicas.

### 🎯 Objetivos Principales

- **Digitalización del proceso nutricional** desde la consulta inicial hasta el seguimiento continuo
- **Automatización de recomendaciones** basadas en datos biométricos y hábitos alimenticios
- **Comunicación en tiempo real** entre profesionales y pacientes
- **Gestión eficiente de citas** con modalidades presenciales y virtuales
- **Análisis de datos de salud** con visualizaciones intuitivas

---

## ✨ Características Principales

### 🔐 Sistema de Autenticación Avanzado

- **Autenticación JWT** con tokens seguros
- **Roles diferenciados** (Paciente/Nutricionista)
- **Recuperación de contraseñas** con tokens temporales
- **Confirmación de cuentas** por email
- **Protección de rutas** basada en roles

### 📊 Dashboard Inteligente

- **Estadísticas en tiempo real** de pacientes y progreso
- **Gráficos interactivos** con Chart.js
- **Métricas de salud** personalizadas
- **Indicadores de rendimiento** (KPIs)

### 👥 Gestión de Pacientes

- **Registro completo** de información personal y médica
- **Historial médico** detallado con seguimiento temporal
- **Parámetros de salud** (peso, estatura, IMC, actividad física)
- **Registro de comidas** con categorización por tipo
- **Análisis de tendencias** de salud

### 🤖 Recomendaciones con IA

- **Generación automática** de recomendaciones nutricionales
- **Análisis de patrones** alimenticios
- **Sugerencias personalizadas** basadas en objetivos de salud
- **Recomendaciones de ejercicio** según nivel de actividad

### 📅 Sistema de Citas

- **Agenda inteligente** con disponibilidad en tiempo real
- **Modalidades mixtas** (presencial/virtual)
- **Gestión de reuniones** con enlaces automáticos
- **Recordatorios** y notificaciones
- **Historial de consultas**

### 💬 Comunicación en Tiempo Real

- **Chat integrado** con Socket.io
- **Mensajería instantánea** entre usuarios
- **Notificaciones push** en tiempo real
- **Historial de conversaciones**

### 📄 Generación de Reportes

- **Exportación a PDF** de historiales médicos
- **Reportes personalizados** con datos completos
- **Gráficos incluidos** en documentos
- **Formato profesional** para uso médico

---

## 🛠️ Stack Tecnológico

### Frontend

- **React 18.2.0** - Biblioteca de interfaz de usuario
- **Vite 6.3.1** - Herramienta de construcción rápida
- **Tailwind CSS 4.1.5** - Framework CSS utility-first
- **React Router DOM 7.6.0** - Enrutamiento de aplicaciones
- **Framer Motion 12.15.0** - Animaciones fluidas

### Gestión de Estado y Datos

- **React Hook Form 7.56.4** - Formularios eficientes
- **Axios 1.9.0** - Cliente HTTP
- **Socket.io Client 4.8.1** - Comunicación en tiempo real

### UI/UX Components

- **React Icons 5.5.0** - Iconografía completa
- **Heroicons 2.2.0** - Iconos de alta calidad
- **Lucide React 0.507.0** - Iconos modernos
- **React Circular Progressbar 2.2.0** - Indicadores de progreso
- **React Toastify 11.0.5** - Notificaciones elegantes

### Utilidades

- **JWT Decode 4.0.0** - Decodificación de tokens
- **Crypto JS 4.2.0** - Encriptación de datos
- **jsPDF 3.0.1** - Generación de PDFs
- **jsPDF AutoTable 5.0.2** - Tablas en PDF

### Testing

- **Vitest 3.2.3** - Framework de testing
- **Testing Library** - Utilidades de testing
- **jsdom 26.1.0** - Entorno DOM para testing

---

## 🏗️ Arquitectura del Sistema

```
src/
├── 📁 components/          # Componentes reutilizables
│   ├── 📁 Alerts/         # Componentes de alertas y notificaciones
│   ├── 📁 Modals/         # Modales y diálogos
│   ├── AuthRoute.jsx      # Protección de rutas
│   ├── DescargarPdf.jsx   # Generación de reportes PDF
│   └── ...
├── 📁 context/            # Contexto de React
│   └── AuthProvider.jsx   # Gestión de autenticación
├── 📁 layout/             # Layouts principales
│   ├── UserDashboardLayout.jsx    # Dashboard de pacientes
│   └── NutriDashboardLayout.jsx   # Dashboard de nutricionistas
├── 📁 pages/              # Páginas de la aplicación
│   ├── Auth/              # Páginas de autenticación
│   ├── Dashboard/         # Páginas del dashboard
│   ├── Management/        # Gestión de datos
│   └── ...
├── 📁 assets/             # Recursos estáticos
├── 📁 test/               # Archivos de testing
└── App.jsx                # Componente principal
```

---

## 📱 Funcionalidades por Rol

### 👨‍⚕️ Nutricionista

- **Dashboard administrativo** con estadísticas globales
- **Gestión de pacientes** con búsqueda y filtros
- **Historial médico completo** de cada paciente
- **Generación de recomendaciones** personalizadas
- **Gestión de citas** con confirmación automática
- **Chat en tiempo real** con pacientes
- **Reportes médicos** en PDF

### 👤 Paciente

- **Dashboard personal** con métricas de salud
- **Registro de parámetros** biométricos
- **Seguimiento de comidas** diarias
- **Visualización de recomendaciones** nutricionales
- **Solicitud de citas** con nutricionistas
- **Chat directo** con profesionales
- **Descarga de reportes** personales

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0 o **yarn** >= 1.22.0
- **Git** para clonar el repositorio

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/saludify.git
cd saludify
```

2. **Instalar dependencias**

```bash
npm install
# o
yarn install
```

3. **Configurar variables de entorno**

```bash
cp .env.example .env
```

4. **Iniciar en modo desarrollo**

```bash
npm run dev
# o
yarn dev
```

5. **Abrir en el navegador**

```
http://localhost:5173
```

---

## ⚙️ Configuración de Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Backend API
VITE_BACKEND_URL= ******************
VITE_BACKEND_API= ******************


# Configuración de Socket.io (opcional)
VITE_SOCKET_URL= ******************

# Configuración de producción
VITE_PRODUCTION_URL= ******************
```

---

## 📦 Scripts Disponibles

| Comando                 | Descripción                              |
| ----------------------- | ---------------------------------------- |
| `npm run dev`           | Inicia el servidor de desarrollo         |
| `npm run build`         | Construye la aplicación para producción  |
| `npm run preview`       | Vista previa de la versión de producción |
| `npm run lint`          | Ejecuta el linter para verificar código  |
| `npm run test`          | Ejecuta las pruebas unitarias            |
| `npm run test:watch`    | Ejecuta pruebas en modo watch            |
| `npm run test:coverage` | Genera reporte de cobertura de pruebas   |

---

## 🌐 Despliegue

### Despliegue en Vercel

1. **Conectar repositorio** a Vercel
2. **Configurar variables de entorno** en el dashboard
3. **Desplegar automáticamente** con cada push

### Despliegue Manual

```bash
# Construir para producción
npm run build

# Servir archivos estáticos
npm run preview
```

### Configuración de Redirecciones

El archivo `public/_redirects` está configurado para SPA:

```
/*    /index.html   200
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Tests unitarios
npm run test

# Tests en modo watch
npm run test:watch

# Cobertura de código
npm run test:coverage
```

### Estructura de Tests

```
src/
├── test/
│   ├── components/
│   ├── pages/
│   └── utils/
└── __tests__/
```

---

## 📊 API Endpoints

### Autenticación

- `POST /login` - Inicio de sesión
- `POST /register` - Registro de usuarios
- `POST /recuperar-password` - Recuperación de contraseña
- `PUT /restablecer-password/:token` - Restablecer contraseña

### Perfiles

- `GET /perfil` - Obtener perfil de paciente
- `GET /perfilNutri` - Obtener perfil de nutricionista
- `PUT /perfil-nutricionista/:id` - Actualizar perfil nutricionista

### Pacientes

- `GET /listar-pacientes` - Listar todos los pacientes
- `GET /listar-nutricionistas` - Listar nutricionistas
- `GET /paciente/:id` - Obtener datos de paciente específico

### Parámetros de Salud

- `GET /paciente/parametro/:id` - Obtener parámetros de paciente
- `POST /parametros-salud/registro` - Registrar nuevos parámetros
- `PUT /actualizar-parametro/:id` - Actualizar parámetros
- `DELETE /eliminar-parametro/:id` - Eliminar parámetros

### Comidas

- `GET /paciente/comidas/:id` - Obtener historial de comidas
- `POST /comidas-paciente/registro` - Registrar nueva comida
- `DELETE /eliminar-comida/:id` - Eliminar comida

### Citas

- `POST /registrar-cita` - Crear nueva cita
- `PUT /confirmar-cita/:id` - Confirmar cita
- `PUT /cancelar-cita/:id` - Cancelar cita
- `DELETE /eliminar-cita/:id` - Eliminar cita

### Recomendaciones

- `GET /recomendacionesParametros/:id` - Generar recomendaciones de parámetros
- `GET /recomendacionesComidas/:id` - Generar recomendaciones de comidas
- `GET /obtener-recomendaciones/:id` - Obtener recomendaciones existentes

---

## 🔒 Seguridad

### Medidas Implementadas

- **Autenticación JWT** con tokens seguros
- **Validación de roles** en frontend y backend
- **Sanitización de datos** en formularios
- **Protección CSRF** en requests
- **Encriptación de contraseñas** con bcrypt
- **Rate limiting** en endpoints críticos
- **Validación de entrada** en todos los formularios

### Buenas Prácticas

- **Principio de menor privilegio** en roles
- **Logs de auditoría** para acciones críticas
- **Validación de tokens** en cada request
- **Manejo seguro de errores** sin exposición de datos

---

### Estándares de Código

- **ESLint** configurado para mantener calidad
- **Prettier** para formato consistente
- **Conventional Commits** para mensajes de commit
- **Testing** requerido para nuevas funcionalidades

---

## 📄 Licencia

Este proyecto está bajo la Licencia Apache 2.0. Ver el archivo [LICENSE](LICENSE) para más detalles.

### ¿Qué permite la Licencia Apache 2.0?

- ✅ **Uso comercial** - Puedes usar este código en proyectos comerciales
- ✅ **Modificación** - Puedes modificar y adaptar el código
- ✅ **Distribución** - Puedes distribuir el código
- ✅ **Uso privado** - Puedes usar el código en proyectos privados
- ✅ **Protección de patentes** - Incluye cláusulas de protección de patentes
- ✅ **Reconocimiento académico** - Ideal para tesis y proyectos de investigación

---

## 👨‍💻 Autores

### Desarrolladores Principales

<table>
  <tr>
    <td align="center">
    <sub>Frontend</sub>
      <br />
      <a href="https://github.com/Andrespipe1">
        <img src="https://avatars.githubusercontent.com/Andrespipe1" width="100px;" alt=""/>
        <br />
        <sub><b>Andrés Felipe Tufiño Muñoz</b></sub>
      </a>
      <br />
      <sub>Full Stack Developer</sub>
    </td>
  </tr>
    <tr>
    <td align="center">
      <sub>Backend</sub>
      <br />
      <a href="https://github.com/Wilmer-Vnr">
        <img src="https://avatars.githubusercontent.com/Wilmer-Vnr" width="100px;" alt=""/>
        <br />
        <sub><b>Wilmer Vargas</b></sub>
      </a>
      <br />
      <sub>Full Stack Developer</sub>
    </td>
  </tr>
</table>

### Contacto

- 📧 **Email**: andresftma@gmail.com
- 🌐 **Website**: https://frontendsdy.vercel.app
- 📱 **LinkedIn**: [Perfil LinkedIn](#)

---

<div align="center">

**¿Te gustó el proyecto? ¡Dale una ⭐!**

[![GitHub stars](https://img.shields.io/github/stars/Andrespipe1/FRONTEND-SDY?style=social)](https://github.com/Andrespipe1/FRONTEND-SDY)
[![GitHub forks](https://img.shields.io/github/forks/Andrespipe1/FRONTEND-SDY?style=social)](https://github.com/Andrespipe1/FRONTEND-SDY)

_Construido con ❤️ para mejorar la salud digital_

</div>

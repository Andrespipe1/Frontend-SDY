# 🩺 SALUDIFY - Plataforma Integral de Nutrición y Salud

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-6.3.1-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.5-38B2AC?style=for-the-badge&logo=tailwind-css)
![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=for-the-badge&logo=node.js)

**Sistema de monitoreo de salud integral para nutricionistas y pacientes**

[🚀 Demo en Vivo](#) • [📖 Documentación](#) • [🐛 Reportar Bug](#) • [💡 Solicitar Feature](#)

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
- [📈 Roadmap](#-roadmap)
- [🤝 Contribución](#-contribución)
- [📄 Licencia](#-licencia)
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
VITE_BACKEND_URL=http://localhost:3000/api
VITE_BACKEND_API=http://localhost:3000

# Configuración de la aplicación
VITE_APP_NAME=SALUDIFY
VITE_APP_VERSION=1.0.0

# Configuración de Socket.io (opcional)
VITE_SOCKET_URL=http://localhost:3000

# Configuración de producción
VITE_PRODUCTION_URL=https://tu-dominio.com
```

---

## 📦 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Construye la aplicación para producción |
| `npm run preview` | Vista previa de la versión de producción |
| `npm run lint` | Ejecuta el linter para verificar código |
| `npm run test` | Ejecuta las pruebas unitarias |
| `npm run test:watch` | Ejecuta pruebas en modo watch |
| `npm run test:coverage` | Genera reporte de cobertura de pruebas |

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

## 📈 Roadmap

### 🚀 Versión 2.0 (Próximamente)
- [ ] **Integración con wearables** (Apple Watch, Fitbit)
- [ ] **Análisis de imágenes** de comidas con IA
- [ ] **Sistema de recordatorios** inteligentes
- [ ] **Gamificación** del proceso nutricional
- [ ] **API pública** para desarrolladores

### 🔮 Versión 3.0 (Futuro)
- [ ] **Machine Learning** para predicciones de salud
- [ ] **Integración con laboratorios** médicos
- [ ] **Telemedicina** completa con video llamadas
- [ ] **App móvil** nativa (iOS/Android)
- [ ] **Blockchain** para historiales médicos

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Por favor, lee nuestras guías de contribución:

### Cómo Contribuir

1. **Fork** el proyecto
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

### Estándares de Código

- **ESLint** configurado para mantener calidad
- **Prettier** para formato consistente
- **Conventional Commits** para mensajes de commit
- **Testing** requerido para nuevas funcionalidades

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autores

### Desarrolladores Principales

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/tu-usuario">
        <img src="https://avatars.githubusercontent.com/tu-usuario" width="100px;" alt=""/>
        <br />
        <sub><b>Andrés Felipe Tufiño Muñoz</b></sub>
      </a>
      <br />
      <sub>Full Stack Developer</sub>
    </td>
    <td align="center">
      <a href="https://github.com/tu-usuario">
        <img src="https://avatars.githubusercontent.com/tu-usuario" width="100px;" alt=""/>
        <br />
        <sub><b>Wilmer David Vargas Nilve</b></sub>
      </a>
      <br />
      <sub>Full Stack Developer</sub>
    </td>
  </tr>
</table>

### Contacto

- 📧 **Email**: contacto@saludify.com
- 🌐 **Website**: https://saludify.com
- 📱 **LinkedIn**: [Perfil LinkedIn](#)

---

<div align="center">

**¿Te gustó el proyecto? ¡Dale una ⭐!**

[![GitHub stars](https://img.shields.io/github/stars/tu-usuario/saludify?style=social)](https://github.com/tu-usuario/saludify)
[![GitHub forks](https://img.shields.io/github/forks/tu-usuario/saludify?style=social)](https://github.com/tu-usuario/saludify)

*Construido con ❤️ para mejorar la salud digital*

</div>
# 🩺 SALUDIFY - Sistema de monitoreo de salud

## 📝 Descripción
Sistema para nutricionistas enfocado a monitorear la salud de pacientes y dar recomendaciones mediante APIs externas
Desarrollado con React, Tailwind CSS y Vite.

## 👨‍💻 Autores
* **Andrés Felipe Tufiño Muñoz**
* **Wilmer David Vargas Nilve**

## 🛠️ Tecnologías Utilizadas
- React
- Tailwind CSS 
- Vite
- Chart.
- Framer-motion
- React Router DOM 
- Axios 

## 📁 Estructura del Proyecto
```
src/
├── components/     # Componentes reutilizables
├── context/       # Contexto de autenticación
├── layout/        # Layouts principales
├── pages/         # Páginas de la aplicación
├── routes/        # Configuración de rutas
└── services/      # Servicios de API
```

## ⭐ Características
- Autenticación y autorización
- Dashboard con estadísticas
- Gestión de pacientes
- Recomendaciones generadas por IA
- Registro de parametros de salud
- Chat en tiempo real

## 📋 Requisitos
- Node.js >= 16
- npm o yarn
- Variables de entorno configuradas:
  - VITE_URL_BACKEND_API
  - VITE_URL_BACKEND

## 🚀 Instalación

1. Clonar el repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno
```bash
cp .env.example .env
```

4. Iniciar en desarrollo
```bash
npm run dev
```

## ⚡ Scripts Disponibles
- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run preview`: Vista previa de la versión de producción

## 🌐 Despliegue
La aplicación está configurada para despliegue con redirecciones para SPA en el archivo `public/_redirects`.

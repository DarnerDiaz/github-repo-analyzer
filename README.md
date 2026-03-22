# 🤖 GitHub Repository Analyzer - AI-Powered Code Analysis

<div align="center">

**Analyze any GitHub repository using AI-powered insights and interactive conversations**

[![Version](https://img.shields.io/badge/Version-1.0.0-blue)](https://github.com/DarnerDiaz/github-repo-analyzer/releases)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini-API-orange)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/DarnerDiaz/github-repo-analyzer?style=social)](https://github.com/DarnerDiaz/github-repo-analyzer)

[🚀 Features](#-features-principales) • [💻 Stack](#-stack-tecnológico) • [📦 Setup](#-instalación) • [🤝 Contributing](#-contributing)

</div>

---

## ✨ Acerca del Proyecto

**GitHub Repository Analyzer** es una aplicación web inteligente que usa Google Gemini AI para analizar repositorios de GitHub. Permite hacer preguntas interactivas sobre la estructura, funcionalidad y código de cualquier repo público.

**Casos de uso:**
- 📚 Aprender cómo están estructurados proyectos populares
- 🔍 Analizar código de competidores o inspiración
- 💬 Tener conversaciones sobre cualquier repositorio
- 📖 Generar documentación automáticamente
- 🚀 Encontrar patrones y mejores prácticas

---

## ✨ Características Principales

✨ **Chat Interactivo**: Haz preguntas sobre cualquier repositorio de GitHub usando Google Gemini AI
📊 **Análisis de Repositorio**: Análisis automático de la estructura, lenguajes y archivos clave del repositorio
📖 **Visualización de README**: Ver y analizar archivos README de repositorios
🔍 **Búsqueda de Código**: Busca y visualiza archivos específicos dentro de repositorios
📝 **Generación de Documentación**: Genera automáticamente documentación completa para repositorios
🎨 **Interfaz Moderna**: Interfaz limpia y responsive construida con React y Tailwind CSS
💾 **Historial Persistente**: Guarda tus análisis y conversaciones en SQLite
🕐 **Historial de Conversaciones**: Accede a conversaciones anteriores desde la barra lateral
🛡️ **Mejor Manejo de Errores**: Error boundaries, toasts y validación robusta
⚡ **API RESTful**: Endpoints para guardar y recuperar análisis y chat

## Stack Tecnológico

- **Frontend**: Next.js 16+ con React 19 y TypeScript
- **Backend**: API Routes de Next.js
- **Base de Datos**: SQLite + Prisma ORM
- **Estilos**: Tailwind CSS
- **IA**: Google Gemini API (generative-ai)
- **Integración GitHub**: Octokit REST API
- **Renderizado Markdown**: react-markdown
- **Validación**: Zod

## Requisitos Previos

Antes de comenzar, asegúrate de tener:

- Node.js 18+ y npm/yarn instalados
- Una clave de API de Google Gemini (obtén una en [Google AI Studio](https://makersuite.google.com/app/apikey))
- (Opcional) Un Token de Acceso Personal de GitHub para límites de tasa más altos

## Instalación

### Opción 1: Setup Automático (Recomendado)

**Windows:**
```bash
setup.bat
```

**Linux/macOS:**
```bash
bash setup.sh
```

### Opción 2: Setup Manual

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/DarnerDiaz/github-repo-analyzer.git
   cd github-repo-analyzer
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   ```bash
   # Copia el archivo de ejemplo
   cp .env.example .env.local
   
   # Edita .env.local y agrega tus claves de API
   nano .env.local  # o tu editor favorito
   ```

   Variables de entorno requeridas:
   - `NEXT_PUBLIC_GEMINI_API_KEY`: Tu clave de API de Google Gemini
   - `GITHUB_TOKEN` (opcional): Token de Acceso Personal de GitHub
   - `DATABASE_URL`: Ruta a la base de datos SQLite (incluida por defecto)

4. **Configura la base de datos**
   ```bash
   npx prisma migrate dev
   ```

5. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

6. **Abre tu navegador**
   Navega a [http://localhost:3000](http://localhost:3000)

## Uso

1. **Ingresa un Repositorio**
   - Ingresa una URL de GitHub (ej: `https://github.com/facebook/react`)
   - O simplemente usa el formato `propietario/repositorio` (ej: `facebook/react`)

2. **Ver Análisis del Repositorio**
   - Ve las estadísticas del repositorio (estrellas, forks, lenguaje)
   - Explora el archivo README
   - Verifica los archivos clave identificados y lenguajes principales

3. **Chatea sobre el Repositorio**
   - Haz preguntas sobre la estructura del código
   - Solicita explicaciones de componentes
   - Obtén información sobre funcionalidad y patrones de diseño

4. **Genera Documentación**
   - Genera automáticamente documentación completa
   - Obtén un análisis estructurado del repositorio

## Configuración de Claves de API

### Google Gemini API

1. Visita [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Haz clic en "Create API Key"
3. Copia la clave en tu archivo `.env.local`

### Token de GitHub (Opcional)

1. Ve a [GitHub Settings → Personal Access Tokens](https://github.com/settings/tokens)
2. Haz clic en "Generate new token"
3. Selecciona los permisos: `repo`, `read:user`
4. Copia el token en tu archivo `.env.local`

## Estructura del Proyecto

```
src/
├── app/
│   ├── api/                    # API Routes
│   │   ├── repositories/       # Guardar análisis
│   │   ├── chat/               # Sesiones de chat y mensajes
│   │   └── history/            # Obtener historial
│   ├── layout.tsx              # Layout raíz
│   ├── page.tsx                # Página principal
│   └── globals.css             # Estilos globales
├── components/
│   ├── Chat/                   # Interfaz de chat
│   ├── RepositoryInput/        # Formulario de entrada
│   ├── CodeViewer/             # Vista previa de código
│   ├── DocumentationViewer/    # Visualizador de documentación
│   ├── HistorySidebar/         # Barra lateral de historial
│   ├── ErrorBoundary/          # Error boundary
│   ├── Toast/                  # Notificaciones
│   └── Skeleton/               # Loaders de esqueleto
├── lib/
│   ├── github.ts               # Integración GitHub API
│   ├── gemini.ts               # Integración Gemini AI
│   ├── prisma.ts               # Cliente Prisma
│   ├── env.ts                  # Validación de variables de entorno
│   ├── api.ts                  # Utilidades de API
│   ├── middleware.ts           # Middleware de error handling
│   ├── hooks/                  # Custom React hooks
│   │   ├── useRepositoryAnalysis.ts
│   │   ├── useChatSession.ts
│   │   ├── useChatMessages.ts
│   │   └── useHistory.ts
│   └── utils.ts                # Funciones de utilidad
├── types/
│   └── index.ts                # Definiciones de tipos TypeScript
└── generated/                  # Generado por Prisma
    └── prisma/                 # Cliente de Prisma

prisma/
├── schema.prisma               # Esquema de base de datos
├── dev.db                      # Base de datos SQLite
└── migrations/                 # Historial de migraciones
```

## Funciones Clave

### `getRepositoryInfo(owner: string, repo: string)`
Obtiene información básica del repositorio incluyendo estrellas, forks e idioma.

### `analyzeRepository(owner: string, repo: string)`
Realiza un análisis profundo de la estructura del repositorio, identifica archivos clave y obtiene el README.

### `sendMessageToGemini(request: ChatRequest)`
Envía un mensaje a la API de Google Gemini con contexto del repositorio para respuestas inteligentes.

### `generateDocumentation(repositoryContent: string, repoName: string)`
Genera automáticamente documentación completa usando IA.

## Preguntas de Ejemplo

Intenta preguntarle a la IA:
- "¿Qué hace este repositorio?"
- "Muéstrame el punto de entrada principal de este proyecto"
- "¿Qué lenguajes de programación se usan en este proyecto?"
- "Explica la arquitectura de este repositorio"
- "¿Cuáles son las dependencias principales?"
- "¿Cómo empiezo con este proyecto?"

## Despliegue

### Desplegar en Vercel (Recomendado)

1. Sube tu código a GitHub
2. Visita [Vercel](https://vercel.com)
3. Importa tu repositorio
4. Agrega tus variables de entorno en el panel de Vercel
5. ¡Despliega!

```bash
# O despliega directamente desde la terminal
npm install -g vercel
vercel
```

### Otras Opciones de Hosting

La aplicación se puede desplegar en cualquier plataforma de hosting de Node.js:
- AWS Amplify
- Railway
- Render
- Netlify Functions

## Limitaciones

- La API de GitHub tiene límites de tasa (60 solicitudes/hora sin autenticar, 6000 con token)
- La vista previa de archivos se limita a 5000 caracteres
- Los archivos binarios no se pueden ver
- Los repositorios grandes pueden tardar más en analizarse

## Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Haz un fork del repositorio
2. Crea una rama de características (`git checkout -b feature/caracteristica-increible`)
3. Confirma tus cambios (`git commit -m 'Agregar característica increíble'`)
4. Sube a la rama (`git push origin feature/caracteristica-increible`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## Soporte

Para problemas, preguntas o sugerencias:

1. Consulta la página de [Issues](https://github.com/DarnerDiaz/github-repo-analyzer/issues)
2. Crea un nuevo issue con información detallada
3. Incluye los pasos para reproducir si reportas un bug

## Documentación

- [DATABASE.md](./DATABASE.md) - Documentación completa de la base de datos y API
- [FEATURES_UPDATE.md](./FEATURES_UPDATE.md) - Guía de características nuevas y hooks
- [QUICK_START.md](./QUICK_START.md) - Guía de inicio rápido

## Roadmap

### ✅ Implementado en v2.0
- [x] Historial persistente de conversaciones
- [x] Base de datos SQLite con Prisma
- [x] API RESTful para guardar y recuperar análisis
- [x] Validación robusta de entorno con Zod
- [x] Error boundaries y manejo de errores mejorado
- [x] Toasts/notificaciones para feedback del usuario
- [x] Componentes de skeleton loading
- [x] Barra lateral de historial de chat

### 📋 Planeado
- [ ] Vista previa de archivos en tiempo real
- [ ] Soporte para repositorios privados
- [ ] Análisis y métricas avanzadas
- [ ] Sugerencias de revisión de código
- [ ] Soporte multidioma
- [ ] Modo oscuro mejorado
- [ ] Exportar análisis como PDF/Markdown
- [ ] Características de colaboración
- [ ] Autenticación de usuario
- [ ] Búsqueda full-text en análisis
- [ ] Tageo y organización de sesiones

---

Hecho con ❤️ para entusiastas y desarrolladores de GitHub

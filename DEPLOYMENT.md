# Guía de Despliegue 🚀

Esta guía cubre el despliegue de tu Analizador de Repositorios GitHub a producción.

## Desplegar en Vercel (Recomendado)

Vercel es el creador de Next.js y proporciona la experiencia de despliegue más simple.

### Opción 1: Vía GitHub (Recomendado)

1. **Sube tu código a GitHub**
   ```bash
   git remote add origin https://github.com/tunombre/github-repo-analyzer.git
   git push -u origin main
   ```

2. **Conecta con Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Haz clic en "Add New Project"
   - Selecciona tu repositorio de GitHub
   - Haz clic en "Import"

3. **Configura Variables de Entorno**
   - En el panel de Vercel, ve a Settings → Environment Variables
   - Agrega tus variables:
     - `NEXT_PUBLIC_GEMINI_API_KEY`: Tu clave de API de Google Gemini
     - `GITHUB_TOKEN` (opcional): Token de Acceso Personal de GitHub

4. **Despliega**
   - Haz clic en "Deploy"
   - Tu aplicación estará en vivo en ~2 minutos

### Opción 2: Despliegue CLI

1. **Instala Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Despliega**
   ```bash
   vercel
   ```

3. **Sigue los indicadores** y configura las variables de entorno

## Desplegar en Railway

Railway es otra opción excelente con despliegues simples basados en git.

1. **Conecta GitHub**
   - Ve a [railway.app](https://railway.app)
   - Haz clic en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Autoriza y selecciona tu repositorio

2. **Establece Variables de Entorno**
   - En Project → Variables
   - Agrega tus claves de API
   - Establece el entorno de Node en `production`

3. **Despliega**
   - Railway desplegará automáticamente en git push

## Desplegar en Render

1. **Conecta Repositorio**
   - Ve a [render.com](https://render.com)
   - Crea un nuevo Web Service
   - Conecta tu cuenta de GitHub
   - Selecciona tu repositorio

2. **Configura**
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Agrega variables de entorno

3. **Despliega**
   - Haz clic en "Create Web Service"

## Desplegar en AWS Amplify

1. **Conecta Repositorio**
   - Ve a AWS Amplify Console
   - Selecciona "New app" → "Host web app"
   - Elige GitHub y autoriza

2. **Configura Build**
   ```
   Build settings:
   - Build command: npm install && npm run build
   - Base directory: .next
   - Start command: npm start
   - Node version: 18.x
   ```

3. **Variables de Entorno**
   - Agrega tus claves de API en la consola de Amplify
   - Despliega

## Despliegue Docker

Esta aplicación puede ser containerizada y desplegada en cualquier lugar donde se admita Docker.

### Construir Imagen Docker

1. **Crea Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm ci
   
   COPY . .
   
   RUN npm run build
   
   EXPOSE 3000
   
   ENV NEXT_TELEMETRY_DISABLED=1
   
   CMD ["npm", "start"]
   ```

2. **Construye la Imagen**
   ```bash
   docker build -t github-repo-analyzer:latest .
   ```

3. **Ejecuta el Contenedor**
   ```bash
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_GEMINI_API_KEY=tu_clave \
     github-repo-analyzer:latest
   ```

## Configuración de Variables de Entorno

### Para Todos los Despliegues

Asegúrate de que estas variables estén configuradas en tu plataforma de despliegue:

```
NEXT_PUBLIC_GEMINI_API_KEY = tu_clave_api_google_gemini
GITHUB_TOKEN = tu_token_acceso_personal_github (opcional)
```

### Obtener Claves de API

**Clave de API de Google Gemini:**
1. Ve a [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Haz clic en "Create API Key"
3. Copia la clave

**Token de Acceso Personal de GitHub:**
1. Ve a [github.com/settings/tokens](https://github.com/settings/tokens)
2. Haz clic en "Generate new token"
3. Selecciona permisos: `repo`, `read:user`
4. Copia el token

## Lista de Verificación Post-Despliegue

- [ ] Las variables de entorno están configuradas
- [ ] Las claves de API son válidas y funcionan
- [ ] HTTPS está habilitado
- [ ] Dominio personalizado configurado (opcional)
- [ ] Análisis/monitoreo configurado (opcional)
- [ ] Seguimiento de errores habilitado (opcional)

## Optimización de Rendimiento

Después del despliegue, considera estas optimizaciones:

1. **Habilita Generación Estática**
   - La página de inicio se prerrenderiza para mejor rendimiento

2. **Limitación de Tasa de API**
   - Implementa limitación de tasa en producción
   - Usa token de GitHub para límites más altos (6000 req/hora vs 60)

3. **Caché**
   - Los datos del repositorio pueden almacenarse en caché para reducir llamadas a API
   - Next.js almacena contenido estático automáticamente

## Solución de Problemas

### El Despliegue Falla
- Verifica que todas las variables de entorno estén configuradas
- Verifica la compatibilidad de la versión de Node.js
- Revisa los registros de compilación para errores

### Problemas con Clave de API
- Verifica dos veces la clave de API en variables de entorno
- Prueba que la clave de API funcione localmente primero
- Asegúrate de que no haya espacios ni caracteres especiales

### Rendimiento Lento
- Habilita ISR (Incremento Regeneración Estática)
- Implementa almacenamiento en caché de repositorio
- Usa CDN para activos estáticos

## Monitoreo y Análisis

### Configurar Monitoreo

- **Vercel Analytics**: Integrado, sin configuración necesaria
- **Google Analytics**: Agrega a layout.tsx
- **Sentry**: Seguimiento y monitoreo de errores
- **DataDog**: Monitoreo completo de aplicaciones

## Escalado

Para despliegues de alto tráfico:

1. **Base de datos** (opcional): Almacena datos de repositorio en caché
2. **Caché**: Implementa Redis para resultados de consultas
3. **Limitación de Tasa**: Agrega limitación de solicitudes
4. **Equilibrio de Carga**: Usa el auto escalado de tu plataforma

## Soporte

Si encuentras problemas de despliegue:

1. Consulta la documentación de la plataforma
2. Revisa los registros de la aplicación
3. Verifica las credenciales de API
4. Prueba localmente antes de desplegar

---

¡Feliz despliegue! 🎉

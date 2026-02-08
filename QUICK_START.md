# Guía de Inicio Rápido 🚀

¡Obtén tu Analizador de Repositorios GitHub funcionando en 5 minutos!

## Requisitos Previos

- Node.js 18+ instalado
- Una clave de API de Google Gemini (GRATIS) de [Google AI Studio](https://makersuite.google.com/app/apikey)

## Paso 1: Obtén tu Clave de API

1. Ve a [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Haz clic en "Create API Key" 
3. Copia tu clave de API

## Paso 2: Configura el Entorno

Abre `.env.local` en la raíz del proyecto y agrega:

```
NEXT_PUBLIC_GEMINI_API_KEY=tu_clave_aqui
```

Reemplaza `tu_clave_aqui` con la clave de API que acabas de copiar.

## Paso 3: Inicia el Servidor de Desarrollo

```bash
npm run dev
```

Deberías ver:
```
> github-repo-analyzer@0.1.0 dev
> next dev

▲ Next.js 16.1.6
- Environments: .env.local
  ▲ Next.js 16.1.6
  - Local:        http://localhost:3000
```

## Paso 4: Abre en tu Navegador

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Paso 5: ¡Pruébalo!

1. Ingresa una URL de repositorio o propietario/repositorio en el campo de entrada:
   ```
   facebook/react
   # o
   https://github.com/vercel/next.js
   ```

2. Haz clic en "Analyze"

3. Espera a que se cargue el repositorio (la primera vez puede tomar ~10 segundos)

4. Ahora puedes:
   - **Chatear**: Haz preguntas en el panel derecho
   - **Leer**: Consulta el README en la pestaña Documentación
   - **Aprender**: Ve las estadísticas del repositorio y archivos clave

## Preguntas de Ejemplo para Probar

- "¿De qué trata este proyecto?"
- "¿Cuáles son las principales tecnologías utilizadas?"
- "¿Cómo empiezo a usar esto?"
- "Explica los componentes principales"
- "¿Cuáles son los puntos de entrada de este proyecto?"

## Solución de Problemas

### "Error al cargar el repositorio"
- Verifica que el repositorio existe en GitHub
- Asegúrate de usar el formato correcto: `propietario/repositorio`

### "Error al obtener respuesta del modelo de IA"
- Verifica que tu clave de API sea correcta en `.env.local`
- Asegúrate de que la clave sea de la API de Gemini de Google, no de otro servicio
- Reinicia el servidor de desarrollo después de cambiar `.env.local`

### La Clave de API no Funciona
1. Elimina el archivo `.env.local`
2. Crea uno nuevo con solo:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=tu_clave_real
   ```
3. Detén y reinicia el servidor de desarrollo: `Ctrl+C` luego `npm run dev`

## Compilar para Producción

Cuando estés listo para desplegar:

```bash
npm run build
npm run start
```

## ¿Necesitas Ayuda?

Consulta el [README.md](./README.md) para documentación completa.

---

¡Feliz exploración! 🎉

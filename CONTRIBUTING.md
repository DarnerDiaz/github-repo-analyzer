# Contribuyendo al Analizador de Repositorios GitHub

¡Gracias por tu interés en contribuir! Este documento proporciona directrices e instrucciones para contribuir a este proyecto.

## Código de Conducta

- Sé respetuoso y profesional
- Bienvenido a personas de todos los orígenes
- Enfócate en lo que es mejor para el proyecto
- Reporta el acoso a los mantenedores

## Formas de Contribuir

### 🐛 Reportar Bugs

¿Encontraste un bug? ¡Por favor abre un issue!

1. Verifica si el bug ya ha sido reportado
2. Incluye pasos para reproducir
3. Describe el comportamiento esperado vs el actual
4. Incluye información de tu entorno (OS, versión de Node, etc.)

### ✨ Sugerir Características

¿Tienes una idea? ¡Nos encantaría escucharla!

1. Verifica si ya ha sido sugerida
2. Describe el caso de uso
3. Explica cómo beneficiará a los usuarios
4. Proporciona ejemplos si es posible

### 📝 Mejorar Documentación

¡Las mejoras de documentación siempre son bienvenidas!

- Corrige errores tipográficos
- Aclara explicaciones
- Agrega ejemplos
- Mejora el formato

### 🔧 Enviar Cambios de Código

#### Comenzar

1. **Haz fork del repositorio**
   ```bash
   # Haz clic en "Fork" en GitHub
   ```

2. **Clona tu fork**
   ```bash
   git clone https://github.com/tunombre/github-repo-analyzer.git
   cd github-repo-analyzer
   ```

3. **Crea una rama**
   ```bash
   git checkout -b feature/nombre-de-tu-caracteristica
   # o
   git checkout -b fix/tu-bug-fix
   ```

4. **Instala dependencias**
   ```bash
   npm install
   ```

5. **Realiza tus cambios**
   - Escribe tu código
   - Sigue el estilo de código existente
   - Agrega comentarios para lógica compleja

6. **Prueba tus cambios**
   ```bash
   npm run lint
   npm run type-check
   npm run build
   npm run dev
   ```

7. **Confirma tus cambios**
   ```bash
   git add .
   git commit -m "Descripción de los cambios"
   ```

8. **Sube a tu fork**
   ```bash
   git push origin feature/nombre-de-tu-caracteristica
   ```

9. **Crea un Pull Request**
   - Ve a GitHub y haz clic en "New Pull Request"
   - Describe tus cambios
   - Referencia cualquier issue relacionado
   - Espera la revisión

## Estándares de Codificación

### TypeScript

- Usa TypeScript para todo el código nuevo
- Define tipos e interfaces adecuados
- Evita el tipo `any` a menos que sea necesario
- Usa modo estricto

### Componentes React

- Usa componentes funcionales con hooks
- Usa la directiva `'use client'` para componentes del cliente
- Mantén los componentes enfocados y reutilizables
- Agrega tipado adecuado de props

### Organización de Archivos

```
src/
├── components/ - Componentes React
│   └── ComponentName/
│       └── index.tsx
├── lib/ - Funciones de utilidad y llamadas API
├── types/ - Definiciones de tipos TypeScript
└── app/ - Páginas de Next.js
```

### Convenciones de Nombres

- Componentes: PascalCase (ej: `ChatComponent`)
- Archivos: kebab-case para utilidades, PascalCase para componentes
- Funciones: camelCase (ej: `getRepositoryInfo`)
- Constantes: UPPER_SNAKE_CASE (ej: `API_KEY`)

### Estilo de Código

- Indentación de 2 espacios
- Usa comillas simples para strings
- Usa nombres de variables descriptivos
- Mantén funciones pequeñas y enfocadas
- Agrega comentarios para lógica compleja

### Componente de Ejemplo

```typescript
'use client';

import { useState } from 'react';
import { MyType } from '@/types';

interface MyComponentProps {
  title: string;
  onSubmit: (data: MyType) => void;
}

export default function MyComponent({
  title,
  onSubmit,
}: MyComponentProps) {
  const [state, setState] = useState('');

  const handleClick = () => {
    // Implementación
  };

  return (
    <div className="flex flex-col gap-4">
      <h1>{title}</h1>
      <button onClick={handleClick}>Enviar</button>
    </div>
  );
}
```

## Pruebas

Aunque aún no tenemos pruebas automatizadas, por favor:

1. Prueba tus cambios localmente
2. Prueba con diferentes repositorios
3. Prueba casos de error
4. Verifica la compilación de TypeScript: `npm run type-check`
5. Ejecuta linter: `npm run lint`

## Proceso de Pull Request

1. **Actualiza documentación** si es necesario
2. **Sigue la plantilla de PR** (si se proporciona)
3. **Mantén PRs enfocados** en una sola característica/fix
4. **Proporciona contexto** sobre por qué se necesita el cambio
5. **Sé responsivo** a la retroalimentación

## Directrices de Título de PR

- `feat: Agregar descripción de característica`
- `fix: Corregir descripción de bug`
- `docs: Actualizar documentación`
- `style: Cambios de formato o estilo`
- `refactor: Refactorización de código`

## Plantilla de Descripción de PR

```markdown
## Descripción
Descripción breve de cambios

## Issues Relacionados
Corrige #123

## Cambios Realizados
- Cambio 1
- Cambio 2

## Pruebas Realizadas
¿Cómo probaste esto?

## Capturas de pantalla (si aplicable)
Agrega capturas de pantalla para cambios en UI
```

## Flujo de Git

```bash
# Actualiza tu fork con la rama main
git fetch upstream
git rebase upstream/main

# Realiza cambios y confirma
git commit -m "feat: Agregar nueva característica"

# Sube a tu fork
git push origin feature/tu-caracteristica

# Crea PR en GitHub
```

## Consideraciones de Rendimiento

- Minimiza llamadas a API
- Usa caché cuando sea apropiado
- Optimiza renderización de componentes
- Carga componentes perezosamente si es necesario

## Accesibilidad

- Usa HTML semántico
- Incluye texto alternativo para imágenes
- Asegúrate de que la navegación por teclado funcione
- Prueba con lectores de pantalla

## Documentación

- Mantén README.md actualizado
- Documenta nuevas funciones en comentarios de código
- Actualiza QUICK_START.md si el flujo de trabajo cambia
- Agrega ejemplos si es aplicable

## Estructura del Proyecto

Familiarízate con:

- `src/app/` - Páginas del enrutador de aplicaciones de Next.js
- `src/components/` - Componentes React
- `src/lib/` - Funciones de utilidad
- `src/types/` - Definiciones de tipos TypeScript

## Tareas Comunes

### Agregar un Nuevo Componente

1. Crea carpeta: `src/components/ComponentName/`
2. Crea archivo: `src/components/ComponentName/index.tsx`
3. Agrega tipos TypeScript adecuados
4. Usa `'use client'` si es necesario
5. Exporta el componente

### Agregar una Nueva Función de API

1. Crea/actualiza archivo en `src/lib/`
2. Define tipos en `src/types/`
3. Agrega manejo de errores
4. Documenta parámetros y tipo de retorno
5. Prueba con llamadas API reales

### Agregar una Nueva Página

1. Crea archivo en `src/app/page-name/page.tsx`
2. Usa diseño apropiado
3. Sigue convenciones de Next.js
4. Agrega metadatos/SEO apropiados

## Obtener Ayuda

- Verifica issues y PRs existentes
- Pregunta en comentarios de issue/PR
- Discute ideas antes de cambios mayores
- Revisa código existente para convenciones

## Reconocimiento

Los contribuidores serán:
- Listados en README.md (si lo desean)
- Acreditados en mensajes de commit
- Reconocidos por contribuciones significativas

## Licencia

Al contribuir, aceptas que tus contribuciones serán licenciadas bajo la Licencia MIT.

## ¿Preguntas?

Siéntete libre de:
- Abrir un issue para preguntas
- Iniciar una discusión
- Comentar en issues relacionados
- Preguntar en pull requests

---

¡Gracias por contribuir! 🙌

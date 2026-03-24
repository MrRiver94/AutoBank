# AutoBank Project Guidelines

## Objetivo

Este documento define las pautas base del proyecto para mantener un desarrollo consistente, limpio y escalable desde el inicio.

## Stack Recomendado

- Frontend: React
- Lenguaje: TypeScript
- Bundler: Vite
- Estilos: CSS Modules o una convención clara de estilos por componente
- Calidad: ESLint + Prettier
- Testing: Vitest + React Testing Library

## Por Que TypeScript

Se recomienda TypeScript sobre JavaScript porque aporta:

- Tipado estatico para reducir errores
- Mejor autocompletado y mantenibilidad
- Mayor claridad en componentes, props y estados
- Mejor escalabilidad cuando el proyecto crezca

Si el proyecto fuera una prueba muy rapida, JavaScript podria valer, pero para AutoBank la recomendacion es empezar directamente con TypeScript.

## Principios De Desarrollo

- Priorizar claridad antes que complejidad
- Escribir codigo facil de leer y mantener
- Evitar duplicacion de logica
- Crear componentes pequenos y con responsabilidad unica
- Nombrar variables, funciones y archivos de forma explicita
- Mantener una estructura predecible en todo el proyecto
- Favorecer composicion frente a soluciones monoliticas

## Estructura Inicial Recomendada

```text
src/
  app/
  components/
  features/
  hooks/
  services/
  utils/
  types/
  styles/
```

## Convenciones De Estructura

- `app/`: configuracion global, rutas, providers y layout principal
- `components/`: componentes reutilizables y presentacionales
- `features/`: modulos por funcionalidad
- `hooks/`: hooks reutilizables
- `services/`: acceso a APIs, almacenamiento local y logica externa
- `utils/`: funciones auxiliares puras
- `types/`: tipos compartidos
- `styles/`: variables globales, tema y estilos base

## Convenciones De Codigo

- Usar componentes funcionales
- Tipar props, estados y respuestas de servicios
- Mantener funciones pequenas y enfocadas
- Evitar archivos excesivamente largos
- Extraer logica repetida a hooks o utilidades
- No mezclar logica de negocio con presentacion si puede separarse
- Preferir retornos tempranos para reducir anidacion
- Evitar valores magicos; usar constantes con nombre

## Imports

- Ordenar imports de externos a internos
- Evitar imports no usados
- Preferir rutas claras y consistentes
- No crear dependencias circulares entre modulos

## Convenciones De Nombres

- Componentes: `PascalCase`
- Hooks: `useNombreDelHook`
- Utilidades: `camelCase`
- Tipos e interfaces: `PascalCase`
- Constantes globales: `UPPER_SNAKE_CASE`
- Carpetas: minusculas y descriptivas

## Componentes

- Un componente debe tener una responsabilidad clara
- Las props deben ser minimas y bien definidas
- Evitar componentes gigantes con demasiadas decisiones internas
- Si un componente crece demasiado, dividirlo en piezas mas pequenas

## Estado

- Usar estado local cuando sea suficiente
- Elevar estado solo cuando sea necesario compartirlo
- No introducir gestion global compleja demasiado pronto
- Centralizar logica compartida cuando aparezca una necesidad real

## Servicios Y Datos

- Aislar llamadas externas dentro de `services/`
- Validar y tipar los datos que entran y salen
- No dispersar llamadas a API por componentes de UI
- Mantener separada la transformacion de datos de la renderizacion

## Estilos

- Mantener una estrategia de estilos consistente
- Evitar estilos dispersos sin criterio
- Definir tokens base como colores, espaciado y tipografia
- Priorizar legibilidad, accesibilidad y coherencia visual

## Testing

- Probar la logica critica y los flujos importantes
- Añadir tests a utilidades, hooks y componentes con comportamiento
- No depender solo de pruebas manuales
- Escribir tests claros y enfocados en comportamiento

## Manejo De Errores

- Mostrar errores de forma clara al usuario
- Evitar silencios ante fallos relevantes
- Controlar estados de carga, exito y error
- No esconder excepciones sin registrarlas o tratarlas

## Git Y Flujo De Trabajo

- Trabajar sobre ramas con nombres descriptivos
- Hacer commits pequenos, claros y enfocados
- Mantener cada commit en un estado coherente
- No mezclar cambios de formato con cambios funcionales si puede evitarse

## Convencion De Ramas

- `main`: rama estable principal
- `feature/nombre-corto`: nuevas funcionalidades
- `fix/nombre-corto`: correcciones
- `refactor/nombre-corto`: mejoras internas sin cambio funcional

## Convencion De Commits

- `feat:`
- `fix:`
- `refactor:`
- `style:`
- `test:`
- `docs:`
- `chore:`

Ejemplos:

- `feat: create initial dashboard layout`
- `fix: handle empty account state`
- `docs: add project guidelines`

## Calidad Y Revision

- Ejecutar lint antes de cerrar cambios relevantes
- Mantener formato consistente en todo el repo
- Hacer commits pequenos y con mensajes claros
- Evitar mezclar refactors grandes con cambios funcionales
- Revisar si el cambio respeta la estructura y convenciones del proyecto
- Priorizar consistencia sobre preferencias personales puntuales

## Regla De Oro

Cada cambio debe dejar el codigo al menos igual de claro o mejor que antes.

## Primera Decision Del Proyecto

Salvo que aparezca una restriccion importante, AutoBank se construira con:

- React
- TypeScript
- Vite

Esta sera la base por defecto para mantener velocidad de desarrollo, buena experiencia local y una estructura moderna.

# AutoBank Agents

## Objetivo

Este documento define como vamos a trabajar con agentes y subagentes dentro de AutoBank para acelerar el desarrollo sin perder claridad, ownership ni calidad.

La idea no es crear agentes genericos, sino especialistas que operen sobre partes concretas del proyecto y entreguen resultados faciles de integrar.

## Principios

- Cada agente debe tener un area clara de ownership.
- El coordinador reparte trabajo por dominios, no por tareas ambiguas.
- Los subagentes deben devolver cambios pequenos, verificables y faciles de fusionar.
- Si dos agentes pueden tocar el mismo archivo, hace falta un responsable principal.
- Los tipos compartidos y las decisiones de dominio se acuerdan antes de repartir implementacion.

## Agente Coordinador

Nombre sugerido: `autobank-coordinator`

Responsabilidades:

- Entender el objetivo funcional de cada iteracion.
- Dividir el trabajo en piezas independientes.
- Asignar ownership de archivos antes de empezar.
- Integrar resultados de otros agentes.
- Ejecutar la validacion final del cambio.

No deberia implementar todo por defecto. Su valor principal es orquestar, desbloquear y cerrar cada iteracion con coherencia.

## Agentes Especialistas

### 1. App Shell Agent

Nombre sugerido: `app-shell-agent`

Ownership principal:

- `web/src/app/`
- composicion de pantallas
- layout general
- flujo de sesion en alto nivel

Responsabilidades:

- Mantener `App.tsx` pequeno y legible.
- Orquestar como se conectan auth, dashboard y futuras pantallas.
- Introducir rutas, layouts y providers cuando toque.

Subagentes utiles:

- `routing-subagent`: cuando aparezcan varias vistas o navegacion.
- `layout-subagent`: para estructura visual global y zonas comunes.

### 2. Auth And Permissions Agent

Nombre sugerido: `auth-permissions-agent`

Ownership principal:

- `web/src/features/auth/`
- `web/src/types/auth.ts`

Responsabilidades:

- Login local, estado de sesion y logout.
- Roles y permisos.
- Guards de acceso cuando lleguen nuevas vistas o acciones restringidas.

Subagentes utiles:

- `login-flow-subagent`: UX y validacion del acceso.
- `permissions-subagent`: reglas de permisos y checks reutilizables.

### 3. Dashboard And Analytics Agent

Nombre sugerido: `dashboard-analytics-agent`

Ownership principal:

- `web/src/features/dashboard/`

Responsabilidades:

- Resumenes del periodo.
- Listados de movimientos.
- KPIs, tarjetas y futuras visualizaciones.
- Evolucion del dashboard desde mocks hacia datos reales.

Subagentes utiles:

- `metrics-subagent`: calculos y tarjetas resumen.
- `movements-subagent`: tabla, filtros, ordenacion y estados vacios.
- `charts-subagent`: graficas mensuales y anuales en fases futuras.

### 4. Statements Ingestion Agent

Nombre sugerido: `statements-ingestion-agent`

Ownership principal:

- futuro `web/src/features/statements/`
- futuro `web/src/services/statements/`
- `web/src/types/statements.ts`

Responsabilidades:

- Subida de extractos.
- Parseo del archivo.
- Normalizacion de movimientos.
- Preparacion de datos listos para UI y analitica.

Subagentes utiles:

- `upload-subagent`: seleccion de archivo, validacion y errores.
- `parser-subagent`: lectura del formato crudo.
- `normalization-subagent`: transformar datos a contratos internos.

### 5. Design System Agent

Nombre sugerido: `design-system-agent`

Ownership principal:

- `web/src/styles/`
- `web/src/app/App.css`
- estilos de componentes cuando haya que unificar criterios

Responsabilidades:

- Tokens visuales base.
- Consistencia entre pantallas.
- Accesibilidad visual, espaciados y estados.
- Evolucion de estilos locales a una base de diseno reutilizable.

Subagentes utiles:

- `tokens-subagent`: colores, tipografia y espaciado.
- `responsive-subagent`: ajustes de mobile y desktop.

### 6. QA And Tooling Agent

Nombre sugerido: `qa-tooling-agent`

Ownership principal:

- `web/eslint.config.js`
- futuro setup de `vitest`
- scripts y validaciones de calidad

Responsabilidades:

- Lint, tests y checks locales.
- Preparar utilidades de testing.
- Detectar regresiones y gaps de cobertura.

Subagentes utiles:

- `component-test-subagent`: tests de UI con comportamiento.
- `domain-test-subagent`: tests de utilidades y transformaciones.

## Ownership Actual Recomendado

Con el estado actual del repo, esta es la separacion mas natural:

- `app-shell-agent`: `web/src/app/App.tsx`
- `auth-permissions-agent`: `web/src/features/auth/**`, `web/src/types/auth.ts`
- `dashboard-analytics-agent`: `web/src/features/dashboard/**`
- `statements-ingestion-agent`: `web/src/types/statements.ts` hasta que exista `features/statements`
- `design-system-agent`: `web/src/app/App.css`, `web/src/styles/index.css`
- `qa-tooling-agent`: `web/package.json`, `web/eslint.config.js`, futuros tests

## Reglas De Delegacion

Antes de crear subagentes:

1. Definir el objetivo funcional exacto.
2. Marcar que archivos puede tocar cada uno.
3. Separar trabajo de UI, dominio y tooling cuando sea posible.

Durante la ejecucion:

- Un agente no debe reescribir archivos fuera de su ownership salvo acuerdo explicito.
- Si una tarea cambia tipos compartidos, ese trabajo se hace primero o se coordina desde el agente principal del dominio.
- Si hay dependencia fuerte entre dos tareas, no conviene ejecutarlas en paralelo.

Al cerrar una tarea:

- Cada agente debe indicar que cambio, que asumio y como lo verifico.
- El coordinador revisa integracion, lint y coherencia funcional.

## Flujo De Trabajo Recomendado

### Para cambios pequenos

- Trabaja solo el agente especialista del area.
- El coordinador revisa y valida.

### Para cambios medianos

- El coordinador divide en 2 o 3 piezas.
- Se lanzan agentes en paralelo con ownership separados.
- Se integra al final en una unica pasada.

### Para cambios grandes

- Primero un agente de dominio define contratos y limites.
- Despues se reparten UI, logica y QA.
- El coordinador cierra con validacion de extremo a extremo.

## Riesgos A Vigilar

- `App.tsx` puede convertirse en punto de conflicto entre app shell, auth y dashboard.
- `types/statements.ts` es compartido entre ingest, dashboard y futuras analiticas.
- Los mocks de `dashboard/mockData.ts` mezclan datos de auth y dominio; conviene separarlos cuando avancemos.
- Sin tests, varios agentes pueden romper comportamiento correcto sin detectarlo.

## Siguiente Configuracion Recomendada Para AutoBank

Para la siguiente fase del proyecto, recomiendo trabajar con esta estructura base:

1. `autobank-coordinator`
2. `auth-permissions-agent`
3. `dashboard-analytics-agent`
4. `statements-ingestion-agent`
5. `qa-tooling-agent`

El `design-system-agent` puede activarse en paralelo cuando empecemos una mejora visual fuerte o una unificacion de estilos.

## Como Los Usaremos En La Practica

Cuando sigamos desarrollando, el flujo ideal sera:

1. Definir una tarea concreta.
2. Elegir el agente principal segun el dominio.
3. Crear subagentes solo si hay piezas realmente separables.
4. Ejecutar implementacion y validacion con ownership claro.
5. Integrar y revisar el resultado final.

En resumen: primero claridad de responsabilidades, despues paralelismo. Si lo hacemos asi, los agentes nos daran velocidad real en lugar de ruido.

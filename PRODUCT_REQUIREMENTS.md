# AutoBank Product Requirements

## Vision

AutoBank es una aplicacion local orientada al analisis de extractos bancarios. Su objetivo es permitir la carga de extractos mensuales, la lectura de sus datos y la visualizacion clara de movimientos, tendencias y resumenes financieros.

La aplicacion debe empezar con un flujo sencillo y entendible, pero preparada para evolucionar hacia un analisis mas profundo con historicos, graficas mensuales y anuales, y un sistema de usuarios con permisos.

## Objetivo Inicial

La primera etapa del proyecto debe permitir:

- Subir un extracto bancario
- Leer y representar sus datos de forma simple
- Mostrar movimientos y datos basicos del periodo
- Tener una base clara para evolucionar a analisis mas avanzados

## Tipo De Aplicacion

- Aplicacion local en el PC
- Interfaz web construida con React
- Proyecto preparado para escalar en complejidad

## Usuarios

En la fase inicial habra dos tipos principales de usuario.

### Administrador

El administrador tendra un permiso superior o `SUPER_GRANT`.

Responsabilidades iniciales:

- Gestionar configuraciones base
- Tener acceso completo a la aplicacion
- Ver todos los datos disponibles
- Definir o ajustar permisos futuros

### Usuario

Los usuarios normales podran:

- Subir extractos bancarios
- Consultar movimientos
- Visualizar datos y resumenes permitidos

Inicialmente se preve que existan dos usuarios, aunque el sistema debe prepararse para crecer.

## Permisos

En la primera version se puede trabajar con un modelo simple:

- `SUPER_GRANT`
- `UPLOAD_STATEMENTS`
- `VIEW_STATEMENTS`
- `VIEW_ANALYTICS`

Mas adelante estos permisos podran refinarse y agruparse por rol.

## Flujo Principal

El flujo principal de uso sera:

1. Un usuario accede a la aplicacion.
2. Sube un extracto bancario.
3. La aplicacion lee el archivo.
4. Se extraen datos estructurados del extracto.
5. Se muestran movimientos, importes y fechas.
6. Posteriormente esos datos alimentaran paneles y graficas.

## Alcance De La Primera Version

La primera version debe centrarse en entender bien el flujo completo, sin intentar resolver toda la complejidad desde el inicio.

Incluye:

- Carga manual de extracto
- Lectura de datos basicos
- Listado de movimientos
- Resumen simple del periodo
- Base de usuarios y permisos

No incluye aun:

- Analisis financiero avanzado
- Categorizacion automatica compleja
- Graficas historicas completas
- Motor de permisos avanzado
- Integraciones externas complejas

## Entidades Principales

## Usuario

Representa a una persona con acceso a la aplicacion.

Campos orientativos:

- `id`
- `name`
- `email`
- `role`
- `permissions`
- `isActive`

## Rol

Representa un conjunto de privilegios.

Valores iniciales orientativos:

- `admin`
- `user`

## Permiso

Representa una accion autorizada dentro del sistema.

Ejemplos:

- `SUPER_GRANT`
- `UPLOAD_STATEMENTS`
- `VIEW_STATEMENTS`
- `VIEW_ANALYTICS`

## Extracto Bancario

Representa el archivo subido por el usuario.

Campos orientativos:

- `id`
- `fileName`
- `uploadedBy`
- `uploadedAt`
- `periodMonth`
- `periodYear`
- `sourceBank`
- `status`

## Movimiento

Representa una linea o transaccion leida desde el extracto.

Campos orientativos:

- `id`
- `statementId`
- `date`
- `description`
- `amount`
- `balance`
- `type`
- `category`

## Resumen De Periodo

Representa la informacion agregada de un extracto o de un mes.

Campos orientativos:

- `incomeTotal`
- `expenseTotal`
- `netTotal`
- `movementCount`
- `periodMonth`
- `periodYear`

## Fases Previstas

## Fase 1

Base funcional minima.

- Proyecto base en React + TypeScript
- Sistema simple de usuarios
- Subida de extractos
- Lectura de datos de ejemplo
- Visualizacion basica

## Fase 2

Estructuracion y mejora del analisis.

- Normalizacion de movimientos
- Filtros
- Busqueda
- Resumenes mas detallados
- Preparacion para historicos

## Fase 3

Analisis avanzado.

- Graficas mensuales
- Graficas anuales
- Comparativas entre periodos
- Analisis mas exhaustivo de patrones

## Consideraciones Tecnicas Iniciales

- Empezar con datos simples o mockeados si ayuda a validar el flujo
- Separar claramente carga, parseo, transformacion y visualizacion
- Diseñar tipos de TypeScript desde las entidades del dominio
- Mantener trazabilidad de quien sube cada extracto
- Evitar acoplar la UI con el formato crudo del archivo

## Decision Recomendada

La aplicacion debe construirse de forma incremental:

- Primero validar el flujo completo de subida y visualizacion
- Despues consolidar modelos de datos y permisos
- Finalmente introducir analitica y graficas avanzadas

## Resultado Esperado

AutoBank debe convertirse en una herramienta local clara, estructurada y extensible para consultar y analizar extractos bancarios de forma cada vez mas profunda.

---
name: tech-doc
description: >
  Genera documentación técnica estandarizada (Technical Specs, Architecture Decision Records - ADR y Docs as Code)
  para cualquier módulo, API, arquitectura o sistema implementado en el proyecto.
  Analiza automáticamente el código fuente, schema, decisiones de diseño tomadas durante la conversación y cambios en Git.
  Trigger: "crea un doc técnico", "documentación técnica", "tech doc", "generar docs", "/tech-doc", "documentar este módulo".
---

# Technical Documentation Skill (tech-doc)

Esta skill define el estándar profesional de la industria para generar y actualizar documentación técnica de arquitectura, especificaciones de diseño (*Design Docs*) y registros de decisiones arquitectónicas (*ADR*) dentro de la carpeta `docs/` del repositorio.

---

## 1. Lógica de Creación vs. Actualización

- **Si el documento del módulo YA EXISTE en `docs/`**: El agente **DEBE LEER Y ACTUALIZAR** el archivo existente. Se conserva la estructura e historial previo, actualizando el **Estado del Módulo** y añadiendo una entrada en el **Registro de Revisiones (Changelog)**.
- **Si es un módulo NUEVO**: El agente **CREA UN DOCUMENTO NUEVO** en `docs/<nombre_modulo>_implementation.md` declarando su estado inicial (ej. MVP / Producción).
- **Para Registros de Decisiones de Arquitectura Puntuales (ADR)**: `docs/adr_<titulo_decision>.md`.

---

## 2. ¿Cómo determina el Agente las decisiones y el "POR QUÉ"?

El agente **jamás debe limitarse a describir CÓMO funciona el código**. Para documentar las razones reales de arquitectura (*¿Por qué?*):

1. **Historial de la Conversación Activa (Fuente Primaria)**: Extrae los razonamientos, ventajas, descartes de alternativas y restricciones discutidas en el chat durante el pair programming.
2. **Entrevista / Confirmación si se programó fuera del chat**: Si el agente detecta cambios de código significativos (ej. nuevas librerías, nuevos patrones, nuevas tablas) que no fueron discutidos previamente en el chat, **debe preguntar brevemente al usuario la razón técnica** antes de escribir el documento:
   *Ejemplo: "Veo que se integró Brevo para el envío de correos, ¿cuál fue la razón principal de esta elección para incluirla en la sección de decisiones (ADR)?"*
3. **Comentarios en Código y Mensajes de Commit**: Inspecciona si existen notas explicativas en el código o en los commits de Git (`git log -n 5`, `git status`, `git diff`).

---

## 3. Flujo de Trabajo del Agente (Pasos de Ejecución)

Cuando el usuario invoque esta skill o solicite documentación técnica:

1. **Inspección del Contexto y Git**:
   - Revisa la conversación reciente y ejecuta `git status` / `git diff` si está en un entorno Git para identificar el delta de código.
2. **Captura del Por Qué**:
   - Extrae de la conversación las justificaciones de cada decisión. Si hay código nuevo sin contexto conversado, solicita una breve confirmación al usuario.
3. **Verificación de Documento Existente**:
   - Comprueba si existe un archivo relevante en `docs/` (ej. `docs/blog_module_implementation.md`). Si existe, lo lee primero con `view_file`.
4. **Redacción / Actualización**:
   - Aplica la **Plantilla Estandarizada** (Sección 4) adaptando el lenguaje técnico y declarando explícitamente el **Estado del Módulo** (ej. MVP, Producción, Depuración).
5. **Persistencia y Enlaces**:
   - Guarda/Actualiza el archivo en `docs/` utilizando `write_to_file`.
   - Proporciona al usuario el enlace markdown del archivo actualizado.

---

## 4. Plantilla Estandarizada de Documentación Técnica

La documentación generada **DEBE** seguir esta estructura completa:

```markdown
# Arquitectura e Implementación: <Nombre del Módulo o Sistema>

> **Estado del Módulo**: 🟡 MVP (Versión Inicial - Pendiente de depuración) | 🟢 Producción | 🔵 En Refactorización  
> **Última Actualización**: <AAAA-MM-DD>  
> **Proyecto**: <Nombre del Proyecto>

Este documento detalla los fundamentos técnicos, decisiones de diseño, modelo de datos, seguridad, flujos de integración y el estado actual de <Nombre del Módulo>.

---

## 1. Contexto y Objetivos

### Objetivos
- <Objetivo técnico o de negocio 1>
- <Objetivo técnico o de negocio 2>
- <Principios de diseño: simplicidad, rendimiento, seguridad, escalabilidad, etc.>

---

## 2. Decisiones de Arquitectura Justificadas (ADR)

Para cada decisión relevante tomada en el desarrollo, documenta la elección y el motivo técnico (*¿Por qué?*):

### 2.1 <Título de la Decisión 1>
- **Decisión**: <Descripción concisa de la solución elegida>.
- **¿Por qué?**:
  1. **<Motivo 1>**: <Explicación detallada de la ventaja o razón técnica>.
  2. **<Motivo 2>**: <Evitación de problemas, rendimiento, seguridad o compatibilidad>.

---

## 3. Modelo de Datos y Esquemas

Describe el esquema de base de datos, entidades, colecciones o interfaces TypeScript/clases involucradas.

```<lenguaje_schema>
// Ejemplo: Modelo Prisma, TypeORM, SQLAlchemy, Interface TS, Schema Mongo, etc.
```

### Reglas y Restricciones del Modelo
- <Regla de negocio o unicidad 1>
- <Relaciones entre entidades 2>

---

## 4. Diagrama de Arquitectura de la Solución

Incluye un mapa o diagrama de flujo (en bloque de texto ASCII o diagrama Mermaid):

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          Base de Datos / Storage                       │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────┴───────────────────────────────────┐
│                     Capa de Servicios / Controladores                  │
└──────────┬─────────────────────────┬─────────────────────────┬─────────┘
           │                         │                         │
           ▼                         ▼                         ▼
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│     Componente A     │  │     Componente B     │  │     Componente C     │
└──────────────────────┘  └──────────────────────┘  └──────────────────────┘
```

---

## 5. Estructura de Componentes y Funcionalidades

### 5.1 Utilidades e Infraestructura
- **`<ruta/archivo.ext>`**: <Descripción del módulo de utilidad o ayuda>.

### 5.2 Capa de Negocio / API / Server Actions
- **`<función_o_endpoint>`**: <Descripción de operación, parámetros, validaciones y retorno>.

### 5.3 Componentes de Interfaz / Presentación
- **`<Componente>`**: <Descripción de comportamiento de UI, props y estado local>.

---

## 6. Seguridad y Manejo de Errores

- **Autenticación y Autorización**: <Cómo se protegen los datos o rutas (roles, JWT, middleware, etc.)>.
- **Sanitización y Validación**: <Cómo se previenen inyecciones, XSS o datos inválidos (Zod, sanitizadores, etc.)>.
- **Tratamiento de Errores**: <Cómo se capturan y comunican los fallos>.

---

## 7. Inventario de Archivos y Rutas

| Archivo / Ruta | Tipo | Descripción |
| :--- | :--- | :--- |
| `<ruta_o_endpoint>` | <Acceso / Permiso> | <Resumen de función> |

---

## 8. Historial de Revisiones (Changelog)

| Fecha | Estado del Módulo | Cambios Principales |
| :--- | :--- | :--- |
| <AAAA-MM-DD> | 🟡 MVP | Implementación inicial de arquitectura y flujos base. |
| <AAAA-MM-DD> | 🟢 Producción | Depuración de detalles, optimizaciones y lanzamiento. |
```

---

## 5. Reglas de Calidad para el Agente

1. **Declaración Clara del Estado**: Todo documento debe iniciar indicando explícitamente el estado del módulo (ej. `🟡 MVP`, `🟢 Producción`, `🔵 En Refactorización`).
2. **Jamás omitir las razones (*¿Por qué?*)**: El valor principal de la documentación reside en explicar la justificación de las decisiones técnicas. Extraerlas del chat o preguntar brevemente si el código se creó fuera de la sesión.
3. **Independencia del Stack**: La plantilla debe adaptarse fluidamente a cualquier tecnología (React, Vue, Angular, Node.js, Python/Django/FastAPI, Go, Java, PHP, C#, etc.).
4. **Enlaces Clickables**: Siempre enlaza las rutas de archivos con la sintaxis markdown `[basename](file:///ruta/absoluta/al/archivo)`.
5. **Registro de Revisiones**: Cada vez que se actualice el documento, se debe agregar una fila al **Historial de Revisiones (Changelog)** al final del documento.

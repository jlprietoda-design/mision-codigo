<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Misión Código — Contexto del proyecto

## Qué es

Plataforma web educativa gratuita para que niños de 7-12 años aprendan programación mediante misiones gamificadas. Sin anuncios, sin email para niños, sostenida por donaciones.

## Stack técnico

- **Next.js 16** App Router + TypeScript + Tailwind CSS v4
- **Supabase** (Auth + PostgreSQL + RLS)
- **Blockly** para editor visual de bloques
- **Zustand** para estado global del cliente
- **Vercel** para deploy
- **IMPORTANTE:** Next.js 16 usa `proxy.ts` en lugar de `middleware.ts`. La función exportada se llama `proxy`, no `middleware`. Leer `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md` antes de tocar el routing.

## Estructura de carpetas

```
src/
├── app/
│   ├── (auth)/          # Grupo de rutas: /login y /registro (sin layout privado)
│   ├── app/             # Rutas privadas protegidas por proxy.ts
│   └── actions/         # Server Actions
├── components/
│   ├── auth/            # LoginForm, RegisterForm, etc.
│   ├── layout/          # Navbar, Sidebar, Footer, etc.
│   ├── mission/         # MissionCard, BlocklyEditor, MissionMap, etc.
│   ├── family/          # FamilyDashboard, ChildCard, ProgressChart, etc.
│   └── ui/              # Button, Card, Input, Badge, etc. (componentes base)
├── lib/
│   └── supabase/
│       ├── client.ts    # createBrowserClient — usar en Client Components
│       ├── server.ts    # createServerClient con await cookies() — usar en Server Components
│       └── schema.sql   # Esquema completo de la base de datos
├── stores/              # Zustand stores
├── hooks/               # Hooks personalizados
└── types/
    └── index.ts         # Todos los tipos TypeScript globales
```

## Roles de usuario

| Rol       | Descripción                                                                   |
|-----------|-------------------------------------------------------------------------------|
| `family`  | Padre/madre/tutor. Crea perfiles infantiles y ve el progreso de sus hijos.    |
| `teacher` | Profesor. Crea clases y asigna misiones (funcionalidad de fase 2).            |
| `admin`   | Gestiona toda la plataforma: contenido, usuarios, moderación.                 |

**Los niños NO tienen cuenta propia.** Acceden mediante perfiles infantiles (`child_profiles`) creados por un adulto con rol `family`.

## Base de datos (Supabase/PostgreSQL)

Tablas: `profiles`, `child_profiles`, `levels`, `missions`, `mission_progress`, `badges`, `child_badges`, `projects`.

Decisiones importantes:
- RLS habilitado en todas las tablas.
- `is_admin()` usa `SECURITY DEFINER` para evitar recursión infinita al evaluar políticas sobre `profiles`.
- `handle_new_user()` crea automáticamente una fila en `profiles` al registrarse (trigger en `auth.users`).
- `cookies()` de `next/headers` es **async** en Next.js 16 — siempre usar `await cookies()`.
- El cliente server de Supabase usa `getAll`/`setAll` (los métodos `get`/`set`/`remove` están deprecados en `@supabase/ssr`).

## Convenciones de código

- Server Actions en `src/app/actions/`.
- Hooks personalizados en `src/hooks/`.
- Todos los textos de la UI en español.
- Mensajes de error amigables, nunca técnicos (no mostrar stack traces ni mensajes de Supabase al usuario).
- Loading states en todos los botones de formulario.
- Validación en cliente antes de enviar al servidor.
- No añadir comentarios que expliquen QUÉ hace el código — solo añadir comentarios cuando el POR QUÉ no es obvio.

## Diseño visual

- Color de fondo: `#0d0d1a` (negro/azul muy oscuro)
- Color principal (púrpura): `#534AB7`
- Color de acción (verde): `#00d4a1`
- Estilo gamificado — parece un videojuego, no una academia.
- Textos grandes y claros, pensados para niños.

## Seguridad infantil (respetar siempre, sin excepciones)

- **NUNCA** pedir email a niños.
- **NUNCA** permitir chat libre entre usuarios.
- **NUNCA** mostrar datos de otros perfiles.
- Proyectos `private` por defecto.
- Un adulto solo puede ver y editar sus propios perfiles infantiles.

## Personaje: Codi

Robot mentor amable que acompaña al niño durante las misiones. En MVP usa pistas predefinidas en el campo `hints` de la tabla `missions` (no IA generativa). Solo en el Nivel 9 se activa IA real con restricciones estrictas de contenido.

## Rutas principales

**Públicas:**
`/` | `/como-funciona` | `/niveles` | `/familias` | `/seguridad` | `/donar` | `/login` | `/registro`

**Privadas** (protegidas por `src/proxy.ts`, redirigen a `/login?next=<ruta>` sin sesión):
`/app/familia` | `/app/perfil/[childId]` | `/app/mapa` | `/app/mision/[misionId]` | `/app/progreso/[childId]`

## Estado actual del proyecto

| Área                  | Estado        |
|-----------------------|---------------|
| Infraestructura       | ✅ Completada  |
| Base de datos         | ✅ Completada  |
| Autenticación         | 🔲 Pendiente  |
| Panel familiar        | 🔲 Pendiente  |
| Motor de misiones     | 🔲 Pendiente  |
| Editor Blockly        | 🔲 Pendiente  |
| Personaje Codi        | 🔲 Pendiente  |

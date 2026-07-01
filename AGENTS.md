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
- Mensajes de error amigables, nunca técnicos (no mostrar stack traces ni mensajes de Supabase al usuario).
- Loading states en todos los botones de formulario.
- Validación en cliente antes de enviar al servidor.
- No añadir comentarios que expliquen QUÉ hace el código — solo añadir comentarios cuando el POR QUÉ no es obvio.

## Internacionalización (i18n) — OBLIGATORIO

Este proyecto usa **next-intl v4** con locales `['es', 'en']` y `defaultLocale 'es'`.

### Estructura de archivos

- `src/messages/es.json` — todas las cadenas en español
- `src/messages/en.json` — todas las cadenas en inglés
- `src/i18n/routing.ts` — configuración de locales
- `src/i18n/request.ts` — carga de mensajes por locale
- `src/i18n/navigation.ts` — `Link`, `useRouter`, `usePathname` con locale

### Reglas obligatorias

1. **NUNCA escribir texto hardcodeado en los componentes.** Todo texto visible debe venir de los archivos de traducción.

2. Server Components usan `getTranslations()`:
   ```ts
   const t = await getTranslations('seccion');
   ```

3. Client Components usan `useTranslations()`:
   ```ts
   const t = useTranslations('seccion');
   ```

4. Para obtener el locale en Server Components:
   ```ts
   import { getLocale } from 'next-intl/server';
   const locale = await getLocale();
   ```
   Preferible: extraer `locale` de `await params` cuando esté disponible (es la fuente de verdad).

5. Para obtener el locale en Client Components:
   ```ts
   import { useLocale } from 'next-intl';
   const locale = useLocale();
   ```

6. **Navegación siempre con next-intl** (nunca `next/navigation` para links internos):
   ```ts
   import { Link, useRouter, usePathname } from '@/i18n/navigation';
   ```

7. **Rutas:** todas bajo `src/app/[locale]/` — NUNCA crear rutas nuevas fuera de `[locale]/`. Las rutas en `src/app/app/` son legado pre-i18n; no ampliarlas.

8. **Contenido de base de datos bilingüe:**
   - Las misiones tienen campos `_es` y `_en`: `title_es`, `title_en`, `story_es`, `story_en`, `objective_es`, `objective_en`, `concept_es`, `concept_en`, `hints_es`, `hints_en`.
   - Seleccionar campo según locale: `locale === 'en' ? mission.title_en : mission.title_es`
   - Al crear nuevas misiones en `missions.ts` y en SQL seeds, incluir **siempre** ambos idiomas.

9. **Al añadir texto nuevo:**
   - Añadir la clave en `es.json` **y** en `en.json` simultáneamente.
   - Nunca dejar una clave sin traducción en alguno de los dos archivos.

10. **Nombres de niveles bilingües** en `src/lib/data/levels.ts`:
    - `LevelData` tiene `title_es` y `title_en`.
    - Usar `locale === 'en' ? level.title_en : level.title_es` para seleccionar el correcto.

### Secciones actuales en `es.json` / `en.json`

| Namespace    | Contenido                          |
|--------------|------------------------------------|
| `nav`        | Navegación global                  |
| `hero`       | Sección hero de la landing         |
| `trust`      | Barra de confianza                 |
| `howItWorks` | Cómo funciona                      |
| `levels`     | Preview de niveles                 |
| `families`   | Sección familias                   |
| `security`   | Seguridad                          |
| `donate`     | Donaciones                         |
| `footer`     | Pie de página                      |
| `auth`       | Login y registro                   |
| `familia`    | Panel familiar                     |
| `mision`     | Pantalla de misión                 |
| `mapa`       | Mapa de mundos                     |
| `perfil`     | Panel del niño                     |

### Estado de traducción por pantalla

| Pantalla                    | Estado                                                            |
|-----------------------------|-------------------------------------------------------------------|
| Landing page                | ✅ Completamente traducida                                        |
| Auth (login/registro)       | ✅ Traducido                                                      |
| Panel familiar              | ✅ Traducido                                                      |
| Panel del niño (perfil)     | ✅ Traducido                                                      |
| Mapa de mundos              | ✅ Traducido, incluyendo nombres de niveles (`title_es`/`title_en`) |
| Pantalla de misión          | ✅ Traducida, incluyendo contenido de misiones (campos `_es`/`_en`) |
| Panel de progreso           | 🔲 Pendiente de revisar                                          |

## Diseño visual

Tema: CLARO (no oscuro). La app usa fondo claro con acentos púrpura y verde.

Colores principales:
- Fondo principal: `#F8F9FF`
- Fondo cards: `#FFFFFF`
- Fondo secundario (secciones alternas): `#EEF0FF`
- Color principal púrpura: `#534AB7`
- Color acción verde: `#00B894`
- Texto principal: `#1a1a2e`
- Texto secundario: `#4a4a6a`
- Bordes: `#E0E0F0`
- Sombras cards: `box-shadow: 0 2px 12px rgba(83,74,183,0.08)`

Excepción: el hero de la landing page (`/`) mantiene fondo oscuro `#0d0d1a` con estrellas animadas para impacto visual. El resto de la landing y toda la plataforma privada son claras.

Componentes de misión:
- Bloques `move_forward`: fondo verde claro (`#E8F8F5`), texto verde oscuro (`#007a5e`)
- Bloques `turn_left`/`turn_right`: fondo azul claro (`blue-50`), texto azul oscuro (`blue-700`)
- Bloques `repeat`: fondo púrpura claro (`#EEF0FF`), texto púrpura oscuro (`#534AB7`)
- Grid de juego: fondo `#EEF0FF`, celdas `#D8DAFF` con borde
- Panel izquierdo y derecho de misión: fondo blanco

Navbar de plataforma (`AppNavbar`): fondo blanco, borde `#E0E0F0`, links activos en `#534AB7`.
Navbar de landing (`LandingNavbar`): transparente sobre hero oscuro, blanco con borde al hacer scroll.

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

## Variables de entorno

| Variable                          | Descripción                                                        |
|-----------------------------------|--------------------------------------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`        | URL del proyecto Supabase                                          |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | Clave pública de Supabase (anon)                                   |
| `SUPABASE_SERVICE_ROLE_KEY`       | Clave de servicio de Supabase — solo en servidor, nunca exponer    |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clave pública de Stripe (prefijo `pk_`)                        |
| `STRIPE_SECRET_KEY`               | Clave secreta de Stripe (prefijo `sk_`) — solo en servidor        |
| `STRIPE_WEBHOOK_SECRET`           | Secret del webhook de Stripe (prefijo `whsec_`) — obtener con `stripe listen` |
| `NEXT_PUBLIC_BASE_URL`            | URL base de la app (`http://localhost:3000` en local, dominio en producción) |
| `NEXT_PUBLIC_CONTACT_EMAIL`       | Email de contacto para donaciones — cambiar en producción          |

## Estado actual del proyecto

| Área                                              | Estado           |
|---------------------------------------------------|------------------|
| Infraestructura                                   | ✅ Completada     |
| Base de datos                                     | ✅ Schema + seeds ejecutados |
| Autenticación                                     | ✅ Login y registro de adulto |
| Panel familiar                                    | ✅ Perfiles infantiles con CRUD |
| Panel del niño                                    | ✅ Avatar, saludo, accesos |
| Mapa de mundos                                    | ✅ Con panel lateral de misiones y progreso |
| Motor de misiones                                 | ✅ 5 misiones Nivel 0 + 8 misiones Nivel 1 jugables |
| Sistema de progreso e insignias                   | ✅ Completado     |
| Landing page pública                              | ✅ Completada     |
| Páginas secundarias                               | ✅ /como-funciona, /niveles, /familias, /seguridad, /donar |
| Tema visual claro                                 | ✅ Completado     |
| Cierre de sesión                                  | ✅ Completado     |
| Internacionalización (i18n) ES/EN                 | ✅ Completa, incluyendo contenido de misiones |
| Asistente Codi con pistas progresivas             | ✅ Completado     |
| Widget de donaciones                              | ✅ Completado     |
| Nivel 0 — Primeros Pasos                          | ✅ 5 misiones     |
| Nivel 1 — Isla Lógica                             | ✅ 8 misiones     |
| Nivel 2 — Bosque de Bucles                        | ⏳ Pendiente     |
| Panel de progreso para padres                     | ⏳ Pendiente     |
| Página /colegios                                  | ⏳ Pendiente     |
| Asistente Codi con IA real (Nivel 9)              | ⏳ Pendiente     |

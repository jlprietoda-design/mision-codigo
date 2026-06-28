-- ============================================================
-- Misión Código — Esquema de base de datos
-- Ejecutar en el SQL Editor de Supabase (una sola vez)
-- ============================================================


-- ============================================================
-- 1. EXTENSIONES
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ============================================================
-- 2. TABLAS (en orden de dependencias)
-- ============================================================

-- profiles — extiende auth.users
CREATE TABLE public.profiles (
  id          uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        text        NOT NULL DEFAULT 'family'
                          CHECK (role IN ('family', 'teacher', 'admin')),
  name        text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- levels
CREATE TABLE public.levels (
  id          serial      PRIMARY KEY,
  slug        text        UNIQUE NOT NULL,
  title       text        NOT NULL,
  description text,
  emoji       text,
  world_order int         NOT NULL DEFAULT 0,
  is_active   boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- child_profiles
-- La FK a missions.current_mission_id se añade en la sección 5 (ALTER TABLE)
-- porque missions todavía no existe en este punto.
CREATE TABLE public.child_profiles (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  alias               text        NOT NULL,
  age_range           text        CHECK (age_range IN ('6-8', '8-10', '10-12', '12-14')),
  avatar              text        NOT NULL DEFAULT '🤖',
  current_level_id    int         NOT NULL DEFAULT 0,
  current_mission_id  uuid,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- missions
CREATE TABLE public.missions (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  level_id          int         NOT NULL REFERENCES public.levels(id),
  slug              text        NOT NULL,
  title             text        NOT NULL,
  story             text,
  objective         text,
  concept           text,
  mission_type      text,
  blocks_available  jsonb,
  map_config        jsonb,
  sucon             jsonb,
  hints             jsonb,
  extra_challenge   jsonb,
  reward_config     jsonb,
  world_order       int         NOT NULL DEFAULT 0,
  is_active         boolean     NOT NULL DEFAULT false,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- mission_progress
CREATE TABLE public.mission_progress (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  child_profile_id  uuid        NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  mission_id        uuid        NOT NULL REFERENCES public.missions(id),
  status            text        NOT NULL DEFAULT 'not_started'
                                CHECK (status IN ('not_started', 'started', 'completed', 'completed_extra')),
  attempts          int         NOT NULL DEFAULT 0,
  hints_used        int         NOT NULL DEFAULT 0,
  extra_completed   boolean     NOT NULL DEFAULT false,
  started_at        timestamptz,
  completed_at      timestamptz,
  updated_at        timestamptz NOT NULL DEFAULT now(),

  UNIQUE (child_profile_id, mission_id)
);

-- badges
CREATE TABLE public.badges (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text        UNIQUE NOT NULL,
  name        text        NOT NULL,
  description text,
  icon        text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- child_badges
CREATE TABLE public.child_badges (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  child_profile_id  uuid        NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  badge_id          uuid        NOT NULL REFERENCES public.badges(id),
  earned_at         timestamptz NOT NULL DEFAULT now(),

  UNIQUE (child_profile_id, badge_id)
);

-- projects
CREATE TABLE public.projects (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  child_profile_id  uuid        NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  title             text        NOT NULL,
  project_json      jsonb,
  visibility        text        NOT NULL DEFAULT 'private'
                                CHECK (visibility IN ('private', 'class', 'public_moderated')),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);


-- ============================================================
-- 3. FUNCIONES
-- (después de las tablas — LANGUAGE sql valida referencias en creación)
-- ============================================================

-- Actualiza updated_at antes de cada UPDATE
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Devuelve true si el usuario autenticado tiene role = 'admin'.
-- SECURITY DEFINER para que bypasee RLS al consultar profiles y
-- evite recursión infinita cuando se evalúan las políticas de esa tabla.
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Crea automáticamente una fila en profiles cuando un usuario
-- se registra en auth.users.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data ->> 'name',
      split_part(NEW.email, '@', 1)
    ),
    'family'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;


-- ============================================================
-- 4. TRIGGERS
-- ============================================================

-- Auto-crear profile al registrarse en Supabase Auth
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- updated_at automático
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER child_profiles_updated_at
  BEFORE UPDATE ON public.child_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER mission_progress_updated_at
  BEFORE UPDATE ON public.mission_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- 5. FOREIGN KEYS DIFERIDAS
-- (missions ya existe en este punto)
-- ============================================================

ALTER TABLE public.child_profiles
  ADD CONSTRAINT child_profiles_current_mission_id_fkey
  FOREIGN KEY (current_mission_id)
  REFERENCES public.missions(id)
  ON DELETE SET NULL;


-- ============================================================
-- 6. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.child_profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.levels           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.child_badges     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects         ENABLE ROW LEVEL SECURITY;

-- ── profiles ─────────────────────────────────────────────────
-- La inserción real la ejecuta handle_new_user() con SECURITY DEFINER
-- (bypasea RLS). La política INSERT cubre inserciones directas.

CREATE POLICY "profiles: lectura propia o admin"
  ON public.profiles FOR SELECT
  USING (id = auth.uid() OR is_admin());

CREATE POLICY "profiles: inserción propia"
  ON public.profiles FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles: actualización propia o admin"
  ON public.profiles FOR UPDATE
  USING  (id = auth.uid() OR is_admin())
  WITH CHECK (id = auth.uid() OR is_admin());

CREATE POLICY "profiles: eliminación solo admin"
  ON public.profiles FOR DELETE
  USING (is_admin());

-- ── child_profiles ────────────────────────────────────────────

CREATE POLICY "child_profiles: lectura propia o admin"
  ON public.child_profiles FOR SELECT
  USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "child_profiles: inserción propia"
  ON public.child_profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "child_profiles: actualización propia o admin"
  ON public.child_profiles FOR UPDATE
  USING  (user_id = auth.uid() OR is_admin())
  WITH CHECK (user_id = auth.uid() OR is_admin());

CREATE POLICY "child_profiles: eliminación propia o admin"
  ON public.child_profiles FOR DELETE
  USING (user_id = auth.uid() OR is_admin());

-- ── levels ────────────────────────────────────────────────────

CREATE POLICY "levels: lectura de activos o admin"
  ON public.levels FOR SELECT
  USING (is_active = true OR is_admin());

CREATE POLICY "levels: inserción solo admin"
  ON public.levels FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "levels: actualización solo admin"
  ON public.levels FOR UPDATE
  USING (is_admin());

CREATE POLICY "levels: eliminación solo admin"
  ON public.levels FOR DELETE
  USING (is_admin());

-- ── missions ──────────────────────────────────────────────────

CREATE POLICY "missions: lectura de activas o admin"
  ON public.missions FOR SELECT
  USING (is_active = true OR is_admin());

CREATE POLICY "missions: inserción solo admin"
  ON public.missions FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "missions: actualización solo admin"
  ON public.missions FOR UPDATE
  USING (is_admin());

CREATE POLICY "missions: eliminación solo admin"
  ON public.missions FOR DELETE
  USING (is_admin());

-- ── mission_progress ──────────────────────────────────────────

CREATE POLICY "mission_progress: lectura propia o admin"
  ON public.mission_progress FOR SELECT
  USING (
    child_profile_id IN (
      SELECT id FROM public.child_profiles WHERE user_id = auth.uid()
    )
    OR is_admin()
  );

CREATE POLICY "mission_progress: inserción propia"
  ON public.mission_progress FOR INSERT
  WITH CHECK (
    child_profile_id IN (
      SELECT id FROM public.child_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "mission_progress: actualización propia o admin"
  ON public.mission_progress FOR UPDATE
  USING (
    child_profile_id IN (
      SELECT id FROM public.child_profiles WHERE user_id = auth.uid()
    )
    OR is_admin()
  );

CREATE POLICY "mission_progress: eliminación solo admin"
  ON public.mission_progress FOR DELETE
  USING (is_admin());

-- ── badges ────────────────────────────────────────────────────

CREATE POLICY "badges: lectura pública"
  ON public.badges FOR SELECT
  USING (true);

CREATE POLICY "badges: inserción solo admin"
  ON public.badges FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "badges: actualización solo admin"
  ON public.badges FOR UPDATE
  USING (is_admin());

CREATE POLICY "badges: eliminación solo admin"
  ON public.badges FOR DELETE
  USING (is_admin());

-- ── child_badges ───────────────────────────────────────────────
-- Los badges se otorgan desde servidor con service_role (bypasea RLS).
-- La política INSERT solo aplica a inserciones directas de admins.

CREATE POLICY "child_badges: lectura propia o admin"
  ON public.child_badges FOR SELECT
  USING (
    child_profile_id IN (
      SELECT id FROM public.child_profiles WHERE user_id = auth.uid()
    )
    OR is_admin()
  );

CREATE POLICY "child_badges: inserción solo admin"
  ON public.child_badges FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "child_badges: eliminación solo admin"
  ON public.child_badges FOR DELETE
  USING (is_admin());

-- ── projects ──────────────────────────────────────────────────

CREATE POLICY "projects: lectura propia + públicos o admin"
  ON public.projects FOR SELECT
  USING (
    child_profile_id IN (
      SELECT id FROM public.child_profiles WHERE user_id = auth.uid()
    )
    OR visibility = 'public_moderated'
    OR is_admin()
  );

CREATE POLICY "projects: inserción propia"
  ON public.projects FOR INSERT
  WITH CHECK (
    child_profile_id IN (
      SELECT id FROM public.child_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "projects: actualización propia o admin"
  ON public.projects FOR UPDATE
  USING (
    child_profile_id IN (
      SELECT id FROM public.child_profiles WHERE user_id = auth.uid()
    )
    OR is_admin()
  );

CREATE POLICY "projects: eliminación propia o admin"
  ON public.projects FOR DELETE
  USING (
    child_profile_id IN (
      SELECT id FROM public.child_profiles WHERE user_id = auth.uid()
    )
    OR is_admin()
  );


-- ============================================================
-- 7. ÍNDICES
-- ============================================================

CREATE INDEX idx_child_profiles_user_id      ON public.child_profiles(user_id);
CREATE INDEX idx_mission_progress_child_id   ON public.mission_progress(child_profile_id);
CREATE INDEX idx_mission_progress_mission_id ON public.mission_progress(mission_id);
CREATE INDEX idx_missions_level_id           ON public.missions(level_id);

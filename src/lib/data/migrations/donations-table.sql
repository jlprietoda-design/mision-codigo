-- ============================================================
-- Misión Código — Tabla donations
-- Ejecutar una sola vez en el SQL Editor de Supabase
-- ============================================================

CREATE TABLE IF NOT EXISTS public.donations (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id text        UNIQUE NOT NULL,
  amount            int         NOT NULL,        -- en céntimos (EUR)
  currency          text        NOT NULL DEFAULT 'eur',
  provider          text        NOT NULL DEFAULT 'stripe',
  is_recurring      boolean     NOT NULL DEFAULT false,
  locale            text        NOT NULL DEFAULT 'es',
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- Solo admins y service_role pueden leer donaciones
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "donations: solo admin"
  ON public.donations FOR SELECT
  USING (is_admin());

-- Las inserciones las hace el webhook con service_role (bypasea RLS)
-- No se necesita política INSERT para roles normales

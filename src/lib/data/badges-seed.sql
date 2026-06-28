-- ============================================================
-- Misión Código — Seed de insignias
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

INSERT INTO public.badges (slug, name, description, icon) VALUES
  ('primera-instruccion',  'Primera instrucción',    'Completaste tu primera misión',                     '🎯'),
  ('explorador-logico',    'Explorador lógico',      'Completaste el Nivel 0: Primeros Pasos',            '🧭'),
  ('maestro-secuencias',   'Maestro de secuencias',  'Completaste Isla Lógica',                           '📋'),
  ('detectapatrones',      'Detectapatrones',        'Usaste tu primer bucle',                            '🔍'),
  ('cazador-errores',      'Cazador de errores',     'Corregiste tu primer error',                        '🐛'),
  ('sin-pistas',           'Sin pistas',             'Completaste una misión sin usar pistas',            '💡'),
  ('velocista',            'Velocista',              'Completaste una misión en el primer intento',       '⚡'),
  ('perfeccionista',       'Perfeccionista',         'Completaste el reto extra de una misión',           '⭐'),
  ('creador',              'Creador',                'Creaste tu primer proyecto',                        '🎮'),
  ('aprendiz-typescript',  'Aprendiz TypeScript',    'Escribiste tu primera línea de TypeScript',         '💻')
ON CONFLICT (slug) DO NOTHING;

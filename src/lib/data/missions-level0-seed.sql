-- ============================================================
-- Misión Código — Seed Nivel 0: Primeros Pasos
-- Ejecutar DESPUÉS de badges-seed.sql
-- Requerido para que mission_progress pueda guardar progreso.
--
-- NOTA: Si ya existen misiones con progreso guardado, este script
-- fallará por la FK mission_progress.mission_id → missions.id.
-- Ejecutar solo en bases de datos nuevas o de desarrollo.
-- ============================================================

-- Borrar en orden seguro (misiones antes que nivel por la FK)
DELETE FROM public.missions
  WHERE level_id = (SELECT id FROM public.levels WHERE slug = 'primeros-pasos');

DELETE FROM public.levels WHERE slug = 'primeros-pasos';

-- Nivel 0 con id explícito (los datos hardcoded usan levelId: 0)
INSERT INTO public.levels (id, slug, title, description, emoji, world_order, is_active)
VALUES (0, 'primeros-pasos', 'Primeros Pasos', 'Los primeros pasos con Codi', '🚀', 0, true);

-- Las 5 misiones del Nivel 0
-- Los slugs deben coincidir exactamente con los IDs en src/lib/data/missions.ts
INSERT INTO public.missions (level_id, slug, title, story, objective, concept, world_order, is_active) VALUES
  (0, 'primeros-pasos-01', 'Despierta a Codi',
   'Codi acaba de encenderse. Sus baterías están casi vacías y necesita llegar a la estación de carga antes de apagarse.',
   'Lleva a Codi hasta la batería 🔋',
   'Un ordenador ejecuta instrucciones una a una, en el orden en que las escribes.',
   1, true),

  (0, 'primeros-pasos-02', 'Avanza hasta la batería',
   '¡Bien hecho! Pero Codi necesita más energía. Esta vez la batería está más lejos. ¡Tú puedes!',
   'Lleva a Codi hasta la batería 🔋',
   'Puedes usar el mismo bloque varias veces seguidas. Las instrucciones se repiten.',
   2, true),

  (0, 'primeros-pasos-03', 'Gira y avanza',
   'El camino ya no es recto. Codi tiene que doblar una esquina para llegar a su base de carga. ¡Aprende a girar!',
   'Lleva a Codi hasta la batería doblando la esquina 🔋',
   'Los robots pueden girar a la izquierda o a la derecha para cambiar de dirección.',
   3, true),

  (0, 'primeros-pasos-04', 'Cuidado con la roca',
   'Una roca enorme bloquea el camino directo. Codi tendrá que rodearla para llegar a la batería. ¡Planifica bien!',
   'Lleva a Codi hasta la batería esquivando la roca 🔋',
   'Un buen programa prevé los obstáculos y planifica un camino alternativo.',
   4, true),

  (0, 'primeros-pasos-05', 'El camino a la nave',
   'La nave de Codi está en la esquina opuesta del campo. Hay rocas por el camino. ¡Planifica bien la ruta antes de ejecutar!',
   'Lleva a Codi hasta la nave espacial 🔋',
   'Planificar un programa significa pensar todos los pasos antes de ejecutarlos.',
   5, true);

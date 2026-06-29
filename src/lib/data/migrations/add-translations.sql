-- Add bilingual content columns to missions table
ALTER TABLE missions ADD COLUMN IF NOT EXISTS title_es   text;
ALTER TABLE missions ADD COLUMN IF NOT EXISTS title_en   text;
ALTER TABLE missions ADD COLUMN IF NOT EXISTS story_es   text;
ALTER TABLE missions ADD COLUMN IF NOT EXISTS story_en   text;
ALTER TABLE missions ADD COLUMN IF NOT EXISTS objective_es text;
ALTER TABLE missions ADD COLUMN IF NOT EXISTS objective_en text;
ALTER TABLE missions ADD COLUMN IF NOT EXISTS concept_es  text;
ALTER TABLE missions ADD COLUMN IF NOT EXISTS concept_en  text;
ALTER TABLE missions ADD COLUMN IF NOT EXISTS hints_es   jsonb;
ALTER TABLE missions ADD COLUMN IF NOT EXISTS hints_en   jsonb;

-- Populate level-0 missions (primeros-pasos-01 … 05)

UPDATE missions SET
  title_es     = 'Despierta a Codi',
  title_en     = 'Wake up Codi',
  story_es     = 'Codi acaba de encenderse. Sus baterías están casi vacías y necesita llegar a la estación de carga antes de apagarse.',
  story_en     = 'Codi just powered on. Its batteries are almost empty and it needs to reach the charging station before shutting down.',
  objective_es = 'Lleva a Codi hasta la batería 🔋',
  objective_en = 'Take Codi to the battery 🔋',
  concept_es   = 'Un ordenador ejecuta instrucciones una a una, en el orden en que las escribes.',
  concept_en   = 'A computer executes instructions one by one, in the order you write them.',
  hints_es     = '["Usa el bloque Avanzar para mover a Codi","Necesitas avanzar más de una vez","Avanza 2 veces seguidas"]',
  hints_en     = '["Use the Move forward block to move Codi","You need to move more than once","Move forward 2 times in a row"]'
WHERE slug = 'primeros-pasos-01';

UPDATE missions SET
  title_es     = 'Avanza hasta la batería',
  title_en     = 'Advance to the battery',
  story_es     = 'La batería está más lejos esta vez. Codi necesita más pasos para llegar.',
  story_en     = 'The battery is further away this time. Codi needs more steps to get there.',
  objective_es = 'Lleva a Codi hasta la batería 🔋',
  objective_en = 'Take Codi to the battery 🔋',
  concept_es   = 'Puedes usar el mismo bloque varias veces seguidas.',
  concept_en   = 'You can use the same block multiple times in a row.',
  hints_es     = '["Avanza paso a paso","Cuenta las celdas hasta la meta","Necesitas avanzar 3 veces"]',
  hints_en     = '["Move step by step","Count the cells to the goal","You need to move forward 3 times"]'
WHERE slug = 'primeros-pasos-02';

UPDATE missions SET
  title_es     = 'Gira y avanza',
  title_en     = 'Turn and move',
  story_es     = 'El camino ya no es recto. Codi tiene que doblar una esquina para llegar a su base de carga.',
  story_en     = 'The path is no longer straight. Codi needs to turn a corner to reach its charging base.',
  objective_es = 'Lleva a Codi hasta la batería doblando la esquina 🔋',
  objective_en = 'Take Codi to the battery by turning the corner 🔋',
  concept_es   = 'Los robots pueden girar a la izquierda o a la derecha para cambiar de dirección.',
  concept_en   = 'Robots can turn left or right to change direction.',
  hints_es     = '["Primero avanza, luego gira","Después de girar, avanza de nuevo","Avanza → Gira izquierda → Avanza → Avanza"]',
  hints_en     = '["Move first, then turn","After turning, move again","Move → Turn left → Move → Move"]'
WHERE slug = 'primeros-pasos-03';

UPDATE missions SET
  title_es     = 'Cuidado con la roca',
  title_en     = 'Watch out for the rock',
  story_es     = 'Hay una roca enorme bloqueando el camino directo. Codi tiene que encontrar la manera de rodearla.',
  story_en     = 'There''s a huge rock blocking the direct path. Codi needs to find a way around it.',
  objective_es = 'Lleva a Codi hasta la batería esquivando la roca 🔋',
  objective_en = 'Take Codi to the battery avoiding the rock 🔋',
  concept_es   = 'A veces hay que planificar la ruta antes de empezar a programar.',
  concept_en   = 'Sometimes you need to plan the route before you start programming.',
  hints_es     = '["Mira dónde está la roca antes de añadir bloques","Tienes que rodear la roca por arriba o por abajo","Sube, avanza, baja, avanza hasta la meta"]',
  hints_en     = '["Look where the rock is before adding blocks","You need to go around the rock above or below","Go up, move forward, go down, move to the goal"]'
WHERE slug = 'primeros-pasos-04';

UPDATE missions SET
  title_es     = 'El camino a la nave',
  title_en     = 'The path to the ship',
  story_es     = 'El camino a la nave está lleno de obstáculos. Codi debe planificar bien la ruta para llegar.',
  story_en     = 'The path to the ship is full of obstacles. Codi must plan the route carefully to get there.',
  objective_es = 'Lleva a Codi hasta la nave espacial 🚀',
  objective_en = 'Take Codi to the spaceship 🚀',
  concept_es   = 'Programar es planificar: piensa el camino completo antes de ejecutar.',
  concept_en   = 'Programming is planning: think through the full path before running.',
  hints_es     = '["Observa todos los obstáculos antes de empezar","Busca un camino que evite las dos rocas","Ve hacia arriba primero para evitar los obstáculos"]',
  hints_en     = '["Look at all obstacles before starting","Find a path that avoids both rocks","Go up first to avoid the obstacles"]'
WHERE slug = 'primeros-pasos-05';

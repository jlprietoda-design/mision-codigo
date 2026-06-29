-- ============================================================
-- Misión Código — Seed Nivel 1: Isla Lógica
-- Ejecutar DESPUÉS de missions-level0-seed.sql y add-translations.sql
--
-- Activa el nivel 1 y añade sus 8 misiones con contenido bilingüe.
-- ============================================================

-- Activar el nivel 1
INSERT INTO public.levels (id, slug, title, description, emoji, world_order, is_active)
VALUES (1, 'isla-logica', 'Isla Lógica', 'Secuencias y orden de instrucciones', '🏝️', 1, true)
ON CONFLICT (id) DO UPDATE SET is_active = true;

-- Badges de Isla Lógica
INSERT INTO public.badges (slug, name, description, icon) VALUES
  ('maestro-secuencias',      'Maestro de Secuencias',    'Completaste tu primera misión de Isla Lógica', '🧠'),
  ('isla-logica-completada',  'Isla Lógica Conquistada',  'Completaste todas las misiones de Isla Lógica',  '🏝️')
ON CONFLICT (slug) DO NOTHING;

-- Borrar misiones previas del nivel 1 (seguro si no hay progreso guardado)
DELETE FROM public.missions WHERE level_id = 1;

-- Las 8 misiones del Nivel 1
INSERT INTO public.missions (
  level_id, slug, title, story, objective, concept,
  mission_type, blocks_available, map_config,
  hints, world_order, is_active,
  title_es, title_en,
  story_es, story_en,
  objective_es, objective_en,
  concept_es, concept_en,
  hints_es, hints_en
) VALUES

-- M1: El camino recto
(1, 'isla-logica-01', 'El camino recto',
 'Codi ha llegado a Isla Lógica. El camino hasta el centro de la isla es recto, pero largo.',
 'Lleva a Codi al centro de la isla siguiendo el camino recto.',
 'Una secuencia es una lista de instrucciones que se ejecutan una detrás de otra, en orden.',
 'sequence',
 '["move_forward"]',
 '{"width":5,"height":1,"start":{"x":0,"y":0,"direction":"east"},"goal":{"x":4,"y":0},"goalEmoji":"🏛️"}',
 '["Avanza paso a paso","Cuenta cuántas celdas hay hasta la meta","Necesitas usar Avanzar exactamente 4 veces"]',
 1, true,
 'El camino recto', 'The straight path',
 'Codi ha llegado a Isla Lógica. El camino hasta el centro de la isla es recto, pero largo. Necesita seguir las instrucciones en el orden correcto para no perderse.',
 'Codi has arrived at Logic Island. The path to the center of the island is straight, but long. It needs to follow instructions in the correct order to not get lost.',
 'Lleva a Codi al centro de la isla siguiendo el camino recto.',
 'Take Codi to the center of the island following the straight path.',
 'Una secuencia es una lista de instrucciones que se ejecutan una detrás de otra, en orden. Igual que cuando te lavas los dientes: primero coges el cepillo, luego pones pasta, luego cepillas. Si cambias el orden, algo sale mal. Los ordenadores hacen exactamente lo mismo.',
 'A sequence is a list of instructions that run one after another, in order. Just like brushing your teeth: first you pick up the brush, then add toothpaste, then brush. If you change the order, something goes wrong. Computers do exactly the same.',
 '["Avanza paso a paso","Cuenta cuántas celdas hay hasta la meta","Necesitas usar Avanzar exactamente 4 veces"]',
 '["Move step by step","Count how many cells there are to the goal","You need to use Move forward exactly 4 times"]'),

-- M2: Giro a la derecha
(1, 'isla-logica-02', 'Giro a la derecha',
 'Codi debe doblar una esquina para llegar al templo. ¡Cuidado con el orden de las instrucciones!',
 'Lleva a Codi al templo girando a la derecha en la esquina.',
 'El orden en una secuencia lo cambia todo. Avanzar-Girar no es lo mismo que Girar-Avanzar.',
 'sequence',
 '["move_forward","turn_right","turn_left"]',
 '{"width":4,"height":4,"start":{"x":0,"y":0,"direction":"east"},"goal":{"x":3,"y":3},"goalEmoji":"🏛️"}',
 '["Primero avanza hasta llegar a la esquina","Después gira a la derecha","Avanza 3 veces → Gira derecha → Avanza 3 veces"]',
 2, true,
 'Giro a la derecha', 'Turn right',
 'Codi debe doblar una esquina para llegar al templo de la isla. Esta vez el giro es a la derecha. ¡Cuidado con el orden de las instrucciones!',
 'Codi needs to turn a corner to reach the island temple. This time the turn is to the right. Watch the order of instructions!',
 'Lleva a Codi al templo girando a la derecha en la esquina.',
 'Take Codi to the temple by turning right at the corner.',
 'El orden en una secuencia lo cambia todo. Avanzar-Girar no es lo mismo que Girar-Avanzar. Si primero giras y luego avanzas, vas en una dirección. Si primero avanzas y luego giras, llegas a un lugar diferente. Por eso en programación decimos que el orden importa.',
 'The order in a sequence changes everything. Move-Turn is not the same as Turn-Move. If you turn first and then move, you go one direction. If you move first and then turn, you end up somewhere different. That''s why in programming we say order matters.',
 '["Primero avanza hasta llegar a la esquina","Después gira a la derecha","Avanza 3 veces → Gira derecha → Avanza 3 veces"]',
 '["First move forward until you reach the corner","Then turn right","Move 3 times → Turn right → Move 3 times"]'),

-- M3: Dos caminos
(1, 'isla-logica-03', 'Dos caminos',
 'El camino directo a la cueva está bloqueado. Codi puede rodear el obstáculo por arriba o por abajo.',
 'Lleva a Codi a la cueva rodeando la roca.',
 'En programación casi siempre hay más de una solución correcta.',
 'sequence',
 '["move_forward","turn_left","turn_right"]',
 '{"width":5,"height":5,"start":{"x":0,"y":2,"direction":"east"},"goal":{"x":4,"y":2},"goalEmoji":"🏛️","obstacles":[{"x":2,"y":2}]}',
 '["El camino recto está bloqueado","Puedes subir o bajar para rodear la roca","Prueba: sube → avanza → baja → avanza"]',
 3, true,
 'Dos caminos', 'Two paths',
 'El camino directo a la cueva está bloqueado por una roca. Pero Codi es listo: puede rodear el obstáculo por arriba o por abajo. ¡Tú decides!',
 'The direct path to the cave is blocked by a rock. But Codi is smart: it can go around the obstacle above or below. You decide!',
 'Lleva a Codi a la cueva rodeando la roca.',
 'Take Codi to the cave by going around the rock.',
 'En programación casi siempre hay más de una solución. Un problema puede resolverse de muchas maneras diferentes, y todas pueden ser correctas. Los programadores buenos prueban varias soluciones y eligen la mejor.',
 'In programming there is almost always more than one solution. A problem can be solved in many different ways, and all of them can be correct. Good programmers try several solutions and then choose the best one.',
 '["El camino recto está bloqueado","Puedes subir o bajar para rodear la roca","Prueba: sube → avanza → baja → avanza"]',
 '["The straight path is blocked","You can go up or down to go around the rock","Try: go up → move → go down → move"]'),

-- M4: Recoge la gema
(1, 'isla-logica-04', 'Recoge la gema',
 'En el centro de la isla hay una gema mágica que Codi necesita para abrir la puerta del templo.',
 'Recoge la gema y lleva a Codi al templo.',
 'A veces una secuencia tiene objetivos intermedios que debes completar antes de llegar al final.',
 'collect',
 '["move_forward","turn_left","turn_right","pick_item"]',
 '{"width":5,"height":5,"start":{"x":0,"y":4,"direction":"east"},"goal":{"x":4,"y":0},"goalEmoji":"🏛️","items":[{"x":2,"y":2,"id":"gema","emoji":"💎"}],"requiredItem":"gema"}',
 '["Primero planifica la ruta hasta la gema","Recoge la gema con el bloque Recoger","Sin la gema no puedes abrir la puerta final"]',
 4, true,
 'Recoge la gema', 'Collect the gem',
 'En el centro de la isla hay una gema mágica que Codi necesita para abrir la puerta del templo. Pero la gema está en medio del camino — ¡no olvides recogerla antes de llegar a la meta!',
 'In the center of the island there is a magic gem that Codi needs to open the temple door. But the gem is in the middle of the path — don''t forget to pick it up before reaching the goal!',
 'Recoge la gema 💎 y lleva a Codi al templo.',
 'Collect the gem 💎 and take Codi to the temple.',
 'A veces una secuencia tiene objetivos intermedios: cosas que debes hacer en el camino antes de llegar al final. Esto se llama sub-objetivo. No puedes saltarte pasos ni cambiarlos de orden. Tu secuencia debe planificar cada paso del camino.',
 'Sometimes a sequence has intermediate goals: things you must do on the way before reaching the end. This is called a sub-goal. You can''t skip steps or change their order. Your sequence must plan every step of the journey.',
 '["Primero planifica la ruta hasta la gema","Recoge la gema con el bloque Recoger","Sin la gema no puedes abrir la puerta final"]',
 '["First plan the route to the gem","Pick up the gem with the Pick up block","Without the gem you can''t open the final door"]'),

-- M5: Primero la llave
(1, 'isla-logica-05', 'Primero la llave',
 'La puerta del templo está cerrada con llave. La llave está al norte de la isla.',
 'Consigue la llave y abre la puerta del templo.',
 'El orden importa cuando hay dependencias: para hacer el paso B, primero tienes que hacer el paso A.',
 'collect',
 '["move_forward","turn_left","turn_right","pick_item"]',
 '{"width":5,"height":5,"start":{"x":0,"y":4,"direction":"east"},"goal":{"x":4,"y":4},"goalEmoji":"🏛️","items":[{"x":1,"y":0,"id":"llave","emoji":"🗝️"}],"requiredItem":"llave"}',
 '["Primero ve a buscar la llave en el norte","Recógela con el bloque Recoger","Con la llave en el inventario, llega hasta la puerta del templo"]',
 5, true,
 'Primero la llave', 'Key first',
 'La puerta del templo está cerrada con llave. La llave está al norte de la isla. Codi tiene que ir primero a buscar la llave y luego volver para abrir la puerta. ¡El orden lo es todo!',
 'The temple door is locked. The key is in the north of the island. Codi has to get the key first and then come back to open the door. Order is everything!',
 'Consigue la llave 🗝️ y abre la puerta del templo.',
 'Get the key 🗝️ and open the temple door.',
 'El orden importa muchísimo cuando hay dependencias entre pasos. Una dependencia significa que para hacer el paso B, primero tienes que hacer el paso A. Esto pasa constantemente en programación: algunas instrucciones dependen de que otras se hayan ejecutado antes.',
 'Order matters a lot when there are dependencies between steps. A dependency means that to do step B, you first have to do step A. This happens constantly in programming: some instructions depend on others having run before them.',
 '["Primero ve a buscar la llave en el norte","Recógela con el bloque Recoger","Con la llave en el inventario, llega hasta la puerta del templo"]',
 '["First go find the key in the north","Pick it up with the Pick up block","With the key in inventory, reach the temple door"]'),

-- M6: Instrucciones mezcladas
(1, 'isla-logica-06', 'Instrucciones mezcladas',
 '¡Alguien ha mezclado las instrucciones de Codi! Encuentra el error y corrígelo.',
 'Corrige el programa desordenado para llevar a Codi al templo.',
 'Depurar significa encontrar y corregir errores en un programa. Es la habilidad más importante de un programador.',
 'debug',
 '["move_forward","turn_left","turn_right"]',
 '{"width":4,"height":4,"start":{"x":0,"y":3,"direction":"east"},"goal":{"x":3,"y":0},"goalEmoji":"🏛️"}',
 '["Ejecuta el programa y observa dónde falla Codi","¿En qué paso empieza a ir en la dirección equivocada?","El giro debe estar después de avanzar hasta la esquina"]',
 6, true,
 'Instrucciones mezcladas', 'Mixed up instructions',
 '¡Alguien ha mezclado las instrucciones de Codi! El programa está desordenado y Codi no llega a la meta. Tú tienes que encontrar el error y poner las instrucciones en el orden correcto.',
 'Someone has mixed up Codi''s instructions! The program is out of order and Codi can''t reach the goal. You need to find the error and put the instructions in the correct order.',
 'Corrige el programa desordenado para llevar a Codi al templo.',
 'Fix the scrambled program to take Codi to the temple.',
 'Depurar (o "debuggear") significa encontrar y corregir errores en un programa. Es una de las habilidades más importantes de un programador. Cuando un programa no funciona, no significa que el programador sea malo — significa que hay un error que encontrar. La clave es ir paso a paso y ver dónde se rompe la lógica.',
 'Debugging means finding and fixing errors in a program. It''s one of the most important skills a programmer has. When a program doesn''t work, it doesn''t mean the programmer is bad — it means there''s a bug to find. The key is to go step by step and see where the logic breaks.',
 '["Ejecuta el programa y observa dónde falla Codi","¿En qué paso empieza a ir en la dirección equivocada?","El giro debe estar después de avanzar hasta la esquina"]',
 '["Run the program and watch where Codi fails","At which step does it start going the wrong direction?","The turn should come after moving to the corner"]'),

-- M7: Menos errores
(1, 'isla-logica-07', 'Menos errores',
 'El camino a la cima de la isla tiene varios obstáculos. Planifica bien la ruta.',
 'Lleva a Codi a la cima del templo evitando los dos obstáculos.',
 'Probar y corregir es el ciclo fundamental de la programación.',
 'practice',
 '["move_forward","turn_left","turn_right"]',
 '{"width":5,"height":5,"start":{"x":0,"y":4,"direction":"east"},"goal":{"x":4,"y":0},"goalEmoji":"🏛️","obstacles":[{"x":1,"y":2},{"x":3,"y":2}]}',
 '["Mira todos los obstáculos antes de empezar","Necesitas subir para evitar los obstáculos del medio","Planifica la ruta completa antes de añadir bloques"]',
 7, true,
 'Menos errores', 'Fewer mistakes',
 'El camino a la cima de la isla tiene varios obstáculos. Codi necesita planificar bien su ruta. No pasa nada si te equivocas al principio — ¡cada intento te acerca más a la solución!',
 'The path to the top of the island has several obstacles. Codi needs to plan its route carefully. It''s okay if you make mistakes at first — each attempt gets you closer to the solution!',
 'Lleva a Codi a la cima del templo evitando los dos obstáculos.',
 'Take Codi to the top of the temple avoiding both obstacles.',
 'Probar y corregir es el ciclo fundamental de la programación. Se llama ciclo de desarrollo: escribes código → lo ejecutas → ves qué pasa → corriges el error → vuelves a ejecutar. No existe ningún programador en el mundo que escriba código perfecto a la primera. Cada error es información.',
 'Test and fix is the fundamental cycle of programming. It''s called the development cycle: you write code → run it → see what happens → fix the error → run again. No programmer in the world writes perfect code on the first try. Every error is information.',
 '["Mira todos los obstáculos antes de empezar","Necesitas subir para evitar los obstáculos del medio","Planifica la ruta completa antes de añadir bloques"]',
 '["Look at all obstacles before starting","You need to go up to avoid the middle obstacles","Plan the complete route before adding blocks"]'),

-- M8: Ruta perfecta
(1, 'isla-logica-08', 'Ruta perfecta',
 'La prueba final de Isla Lógica. Muchos obstáculos y una gema escondida. ¿Puedes encontrar la ruta más eficiente?',
 'Llega al templo con el menor número de bloques posible. Bonus: recoge la gema.',
 'Una solución óptima resuelve el problema de la mejor manera posible, con el menor número de pasos.',
 'optimization',
 '["move_forward","turn_left","turn_right","pick_item"]',
 '{"width":6,"height":6,"start":{"x":0,"y":5,"direction":"east"},"goal":{"x":5,"y":0},"goalEmoji":"🏛️","obstacles":[{"x":2,"y":3},{"x":3,"y":3},{"x":4,"y":3},{"x":2,"y":1}],"items":[{"x":1,"y":2,"id":"gema","emoji":"💎"}]}',
 '["Mira bien todos los obstáculos antes de empezar","Hay una gema en el camino — recogerla es opcional pero da puntos","Busca la ruta con menos giros posibles"]',
 8, true,
 'Ruta perfecta', 'Perfect route',
 'Esta es la prueba final de Isla Lógica. El camino tiene muchos obstáculos y hay una gema escondida. ¿Puedes llegar a la meta tomando la ruta más eficiente posible?',
 'This is the final test of Logic Island. The path has many obstacles and there''s a hidden gem. Can you reach the goal taking the most efficient route possible?',
 'Llega al templo con el menor número de bloques posible. Bonus: recoge la gema 💎.',
 'Reach the temple with as few blocks as possible. Bonus: collect the gem 💎.',
 'Una solución óptima es la que resuelve el problema de la mejor manera posible — normalmente usando el menor número de pasos. Un buen programador no solo busca que el programa funcione, sino que funcione bien: rápido, con pocos pasos y de forma clara.',
 'An optimal solution is one that solves the problem in the best possible way — usually using the fewest steps. A good programmer doesn''t just look for the program to work, but to work well: fast, with few steps, and clearly.',
 '["Mira bien todos los obstáculos antes de empezar","Hay una gema en el camino — recogerla es opcional pero da puntos","Busca la ruta con menos giros posibles"]',
 '["Look carefully at all obstacles before starting","There''s a gem on the way — picking it up is optional but gives points","Find the route with as few turns as possible"]');

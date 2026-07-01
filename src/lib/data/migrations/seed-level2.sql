-- ============================================================
-- Misión Código — Seed Nivel 2: Bosque de Bucles
-- Ejecutar DESPUÉS de seed-level1.sql
--
-- Activa el nivel 2 y añade sus 8 misiones con contenido bilingüe.
-- ============================================================

-- Activar el nivel 2
INSERT INTO public.levels (id, slug, title, description, emoji, world_order, is_active)
VALUES (2, 'bosque-bucles', 'Bosque de Bucles', 'Bucles y repetición de instrucciones', '🌲', 2, true)
ON CONFLICT (id) DO UPDATE SET is_active = true;

-- Badges del Bosque de Bucles
INSERT INTO public.badges (slug, name, description, icon) VALUES
  ('detecta-patrones',          'Detective de Patrones',       'Completaste tu primera misión del Bosque de Bucles', '🔍'),
  ('bosque-bucles-completado',  'Bosque de Bucles Conquistado','Completaste todas las misiones del Bosque de Bucles',  '🌲')
ON CONFLICT (slug) DO NOTHING;

-- Borrar misiones previas del nivel 2 (seguro si no hay progreso guardado)
DELETE FROM public.missions WHERE level_id = 2;

-- Las 8 misiones del Nivel 2
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

-- M1: El puente largo
(2, 'bosque-bucles-01', 'El puente largo',
 'Codi tiene que cruzar un puente muy largo sobre el río del bosque. Son muchos pasos seguidos.',
 'Cruza el puente usando el menor número de bloques posible.',
 'Un bucle repite instrucciones un número de veces, haciendo el programa más corto y claro.',
 'sequence',
 '["move_forward","repeat"]',
 '{"width":6,"height":1,"start":{"x":0,"y":0,"direction":"east"},"goal":{"x":5,"y":0},"goalEmoji":"🌲"}',
 '["¿Cuántas veces necesitas avanzar?","Prueba el bloque Repetir en lugar de varios Avanzar","Usa Repetir 5 veces con Avanzar dentro"]',
 1, true,
 'El puente largo', 'The long bridge',
 'Codi tiene que cruzar un puente muy largo sobre el río del bosque. Son muchos pasos seguidos. ¿Podrás encontrar una forma más corta de escribir el programa?',
 'Codi needs to cross a very long bridge over the forest river. It''s many steps in a row. Can you find a shorter way to write the program?',
 'Cruza el puente usando el menor número de bloques posible.',
 'Cross the bridge using as few blocks as possible.',
 'Un bucle es una instrucción especial que repite otras instrucciones un número de veces. En vez de escribir "Avanzar" cinco veces seguidas, puedes escribir "Repetir 5 veces: Avanzar". Esto hace el programa más corto, más claro y más fácil de cambiar. Imagina que tienes que dar 100 pasos — ¿preferirías escribir "Avanzar" 100 veces o "Repetir 100 veces: Avanzar"? Los bucles son uno de los inventos más importantes de la programación.',
 'A loop is a special instruction that repeats other instructions a number of times. Instead of writing "Move forward" five times in a row, you can write "Repeat 5 times: Move forward". This makes the program shorter, clearer and easier to change. Imagine you need to take 100 steps — would you rather write "Move forward" 100 times or "Repeat 100 times: Move forward"? Loops are one of the most important inventions in programming.',
 '["¿Cuántas veces necesitas avanzar?","Prueba el bloque Repetir en lugar de varios Avanzar","Usa Repetir 5 veces con Avanzar dentro"]',
 '["How many times do you need to move forward?","Try the Repeat block instead of multiple Move forwards","Use Repeat 5 times with Move forward inside"]'),

-- M2: Menos bloques
(2, 'bosque-bucles-02', 'Menos bloques',
 'Codi ya sabe llegar al otro lado, pero usa demasiados bloques. Tu misión es reescribir el programa de forma más eficiente usando bucles.',
 'Llega a la meta usando solo 2 bloques.',
 'La eficiencia significa hacer lo mismo con menos código.',
 'optimization',
 '["move_forward","repeat"]',
 '{"width":5,"height":1,"start":{"x":0,"y":0,"direction":"east"},"goal":{"x":4,"y":0},"goalEmoji":"🌲"}',
 '["El programa ya funciona pero es largo","¿Puedes sustituir los 4 Avanzar por un solo Repetir?","Repetir 4 veces → Avanzar"]',
 2, true,
 'Menos bloques', 'Fewer blocks',
 'Codi ya sabe llegar al otro lado, pero usa demasiados bloques. Tu misión es reescribir el programa de forma más eficiente usando bucles.',
 'Codi already knows how to get to the other side, but uses too many blocks. Your mission is to rewrite the program more efficiently using loops.',
 'Llega a la meta usando solo 2 bloques.',
 'Reach the goal using only 2 blocks.',
 'La eficiencia en programación significa hacer lo mismo con menos código. Un programa eficiente es más fácil de leer, de entender y de modificar. Si tienes que cambiar el número de pasos, en un programa eficiente solo cambias un número. En un programa ineficiente tendrías que añadir o borrar bloques uno a uno. Los programadores profesionales siempre buscan la solución más eficiente, no solo la que funciona.',
 'Efficiency in programming means doing the same thing with less code. An efficient program is easier to read, understand and modify. If you need to change the number of steps, in an efficient program you only change one number. In an inefficient program you''d have to add or delete blocks one by one. Professional programmers always look for the most efficient solution, not just one that works.',
 '["El programa ya funciona pero es largo","¿Puedes sustituir los 4 Avanzar por un solo Repetir?","Repetir 4 veces → Avanzar"]',
 '["The program already works but it''s long","Can you replace the 4 Move forwards with a single Repeat?","Repeat 4 times → Move forward"]'),

-- M3: Patrón de flores
(2, 'bosque-bucles-03', 'Patrón de flores',
 'El bosque está lleno de flores mágicas en diagonal. Codi debe recogerlas todas siguiendo el patrón del camino.',
 'Recoge las 3 flores 🌸 y llega a la meta.',
 'Un patrón es una secuencia de acciones que se repite — detéctalo y usa un bucle.',
 'sequence',
 '["move_forward","turn_left","turn_right","pick_item","repeat"]',
 '{"width":5,"height":3,"start":{"x":0,"y":2,"direction":"east"},"goal":{"x":4,"y":0},"goalEmoji":"🌲","items":[{"x":1,"y":2,"id":"flor","emoji":"🌸"},{"x":2,"y":1,"id":"flor","emoji":"🌸"},{"x":3,"y":0,"id":"flor","emoji":"🌸"}],"allItemsRequired":true}',
 '["Mira la posición de las flores — ¿ves algún patrón?","Para ir de una flor a la siguiente siempre haces lo mismo","Prueba: Avanzar → Recoger → (Girar ← → Avanzar → Girar → → Avanzar → Recoger) × 2 → Avanzar"]',
 3, true,
 'Patrón de flores', 'Flower pattern',
 'El bosque está lleno de flores mágicas en diagonal. Codi debe recogerlas todas siguiendo el patrón del camino. ¿Puedes detectar el patrón y usar un bucle?',
 'The forest is full of magical flowers in a diagonal. Codi must collect them all following the path pattern. Can you detect the pattern and use a loop?',
 'Recoge las 3 flores 🌸 y llega a la meta.',
 'Collect all 3 flowers 🌸 and reach the goal.',
 'Un patrón es una secuencia de acciones que se repite. Cuando detectas un patrón, puedes usar un bucle para simplificarlo. Por ejemplo, si tienes que hacer "avanzar, girar, recoger" tres veces seguidas, eso es un patrón que se repite 3 veces. Los programadores entrenan su mente para detectar patrones en los problemas — es como un superpoder que te hace escribir programas mucho más cortos y elegantes.',
 'A pattern is a sequence of actions that repeats. When you detect a pattern, you can use a loop to simplify it. For example, if you have to do "move, turn, pick up" three times in a row, that''s a pattern that repeats 3 times. Programmers train their minds to detect patterns in problems — it''s like a superpower that lets you write much shorter and more elegant programs.',
 '["Mira la posición de las flores — ¿ves algún patrón?","Para ir de una flor a la siguiente siempre haces lo mismo","Prueba: Avanzar → Recoger → (Girar ← → Avanzar → Girar → → Avanzar → Recoger) × 2 → Avanzar"]',
 '["Look at the position of the flowers — do you see a pattern?","To go from one flower to the next you always do the same thing","Try: Move → Pick → (Turn left → Move → Turn right → Move → Pick) × 2 → Move"]'),

-- M4: Repetir y girar
(2, 'bosque-bucles-04', 'Repetir y girar',
 'Codi necesita dar una vuelta especial en el bosque. El camino tiene un patrón que se repite varias veces.',
 'Lleva a Codi a la meta usando un bucle que contenga varias instrucciones.',
 'Los bucles pueden contener varias instrucciones dentro, no solo una.',
 'sequence',
 '["move_forward","turn_left","turn_right","repeat"]',
 '{"width":5,"height":5,"start":{"x":0,"y":0,"direction":"east"},"goal":{"x":0,"y":4},"goalEmoji":"🌲"}',
 '["El camino tiene un patrón que se repite","¿Qué instrucciones se repiten juntas?","Repetir 3 veces: Avanzar 4 veces → Girar →"]',
 4, true,
 'Repetir y girar', 'Repeat and turn',
 'Codi necesita dar una vuelta especial en el bosque. El camino tiene un patrón que se repite varias veces. Descubre el patrón y usa un bucle con varias instrucciones dentro.',
 'Codi needs to make a special turn in the forest. The path has a pattern that repeats several times. Find the pattern and use a loop with several instructions inside.',
 'Lleva a Codi a la meta usando un bucle que contenga varias instrucciones.',
 'Take Codi to the goal using a loop that contains multiple instructions.',
 'Los bucles pueden contener varias instrucciones dentro, no solo una. Cuando un bucle tiene múltiples instrucciones, repite todas ellas juntas cada vez. Esto es muy poderoso: puedes crear secuencias complejas que se repiten automáticamente. La clave es identificar qué grupo de instrucciones se repite y cuántas veces. Dentro de un bucle puede haber movimientos, giros, recogidas... ¡cualquier combinación!',
 'Loops can contain several instructions inside, not just one. When a loop has multiple instructions, it repeats all of them together each time. This is very powerful: you can create complex sequences that repeat automatically. The key is to identify which group of instructions repeats and how many times. Inside a loop there can be movements, turns, pickups... any combination!',
 '["El camino tiene un patrón que se repite","¿Qué instrucciones se repiten juntas?","Repetir 3 veces: Avanzar 4 veces → Girar →"]',
 '["The path has a repeating pattern","Which instructions repeat together?","Repeat 3 times: Move forward 4 times → Turn right"]'),

-- M5: Camino cuadrado
(2, 'bosque-bucles-05', 'Camino cuadrado',
 'Codi debe recorrer el perímetro del claro del bosque recogiendo los cristales mágicos en cada esquina.',
 'Recorre el cuadrado completo, recoge los 3 cristales 💎 y vuelve al inicio.',
 'Las formas geométricas tienen estructura perfecta para bucles — un cuadrado se repite 4 veces.',
 'sequence',
 '["move_forward","turn_right","repeat","pick_item"]',
 '{"width":5,"height":5,"start":{"x":0,"y":0,"direction":"east"},"goal":{"x":0,"y":0},"goalEmoji":"🌲","items":[{"x":4,"y":0,"id":"cristal","emoji":"💎"},{"x":4,"y":4,"id":"cristal","emoji":"💎"},{"x":0,"y":4,"id":"cristal","emoji":"💎"}],"allItemsRequired":true}',
 '["Un cuadrado tiene 4 lados iguales","En cada esquina giras a la derecha","Repetir 4 veces: Avanzar × 4 → Recoger → Girar →"]',
 5, true,
 'Camino cuadrado', 'Square path',
 'Codi debe recorrer el perímetro del claro del bosque recogiendo los cristales mágicos en cada esquina. El camino forma un cuadrado perfecto.',
 'Codi must travel the perimeter of the forest clearing collecting the magic crystals at each corner. The path forms a perfect square.',
 'Recorre el cuadrado completo, recoge los 3 cristales 💎 y vuelve al inicio.',
 'Complete the full square, collect all 3 crystals 💎 and return to the start.',
 'Algunos problemas tienen una estructura geométrica perfecta para usar bucles. Un cuadrado tiene 4 lados iguales y 4 giros iguales — eso es exactamente un bucle que se repite 4 veces. Cuando veas formas geométricas como cuadrados, triángulos o espirales, piensa siempre en bucles. Esta es la base de cómo los programadores crean gráficos y animaciones: repiten instrucciones muchas veces con pequeñas variaciones.',
 'Some problems have a geometric structure perfect for loops. A square has 4 equal sides and 4 equal turns — that''s exactly a loop that repeats 4 times. When you see geometric shapes like squares, triangles or spirals, always think of loops. This is the basis of how programmers create graphics and animations: they repeat instructions many times with small variations.',
 '["Un cuadrado tiene 4 lados iguales","En cada esquina giras a la derecha","Repetir 4 veces: Avanzar × 4 → Recoger → Girar →"]',
 '["A square has 4 equal sides","At each corner you turn right","Repeat 4 times: Move forward × 4 → Pick up → Turn right"]'),

-- M6: Cristales en fila
(2, 'bosque-bucles-06', 'Cristales en fila',
 'Los cristales mágicos están alineados en el camino del bosque. Codi tiene que avanzar y recoger cada uno.',
 'Recoge los 5 cristales 💎 y llega a la meta.',
 'Los bucles son perfectos para procesar listas: avanzar y recoger muchas veces.',
 'sequence',
 '["move_forward","pick_item","repeat"]',
 '{"width":7,"height":1,"start":{"x":0,"y":0,"direction":"east"},"goal":{"x":6,"y":0},"goalEmoji":"🌲","items":[{"x":1,"y":0,"id":"cristal","emoji":"💎"},{"x":2,"y":0,"id":"cristal","emoji":"💎"},{"x":3,"y":0,"id":"cristal","emoji":"💎"},{"x":4,"y":0,"id":"cristal","emoji":"💎"},{"x":5,"y":0,"id":"cristal","emoji":"💎"}],"allItemsRequired":true}',
 '["Tienes que avanzar y recoger muchas veces","¿Cuántas veces se repite la misma acción?","Repetir 5 veces: Avanzar → Recoger, luego Avanzar una vez más"]',
 6, true,
 'Cristales en fila', 'Crystals in a row',
 'Los cristales mágicos están alineados en el camino del bosque. Codi tiene que avanzar y recoger cada uno. ¡Usa un bucle para no repetirte!',
 'The magic crystals are lined up on the forest path. Codi has to move forward and collect each one. Use a loop to avoid repeating yourself!',
 'Recoge los 5 cristales 💎 y llega a la meta.',
 'Collect all 5 crystals 💎 and reach the goal.',
 'Los bucles son perfectos para procesar listas de cosas. Cuando tienes que hacer la misma acción con muchos elementos uno tras otro, un bucle lo hace automáticamente. Esto es la base de cómo los ordenadores procesan datos: recorren una lista y hacen algo con cada elemento. En programación real esto se usa constantemente: procesar mensajes, imágenes, usuarios... todo funciona con este mismo principio de bucle.',
 'Loops are perfect for processing lists of things. When you have to do the same action with many elements one after another, a loop does it automatically. This is the basis of how computers process data: they go through a list and do something with each element. In real programming this is used constantly: processing messages, images, users... everything works with this same loop principle.',
 '["Tienes que avanzar y recoger muchas veces","¿Cuántas veces se repite la misma acción?","Repetir 5 veces: Avanzar → Recoger, luego Avanzar una vez más"]',
 '["You have to move and pick up many times","How many times does the same action repeat?","Repeat 5 times: Move → Pick up, then Move one more time"]'),

-- M7: Bucle equivocado
(2, 'bosque-bucles-07', 'Bucle equivocado',
 '¡Alguien programó un bucle incorrecto para Codi! El programa hace que Codi choque con la roca una y otra vez.',
 'Corrige el programa para que Codi llegue a la meta evitando el obstáculo.',
 'Cuando un bucle tiene un error, el error se repite — depurar bucles requiere ir paso a paso.',
 'fix_program',
 '["move_forward","turn_left","turn_right","repeat"]',
 '{"width":5,"height":3,"start":{"x":0,"y":1,"direction":"east"},"goal":{"x":4,"y":1},"goalEmoji":"🌲","obstacles":[{"x":2,"y":1}]}',
 '["Ejecuta el programa y observa qué pasa","El bucle hace que Codi choque — ¿cómo puedes evitar el obstáculo?","Necesitas rodear el obstáculo: Girar ← → Avanzar → Girar → antes de seguir"]',
 7, true,
 'Bucle equivocado', 'Wrong loop',
 '¡Alguien programó un bucle incorrecto para Codi! El programa hace que Codi choque con la roca una y otra vez. Encuentra el error y corrígelo.',
 'Someone programmed an incorrect loop for Codi! The program makes Codi crash into the rock over and over. Find the error and fix it.',
 'Corrige el programa para que Codi llegue a la meta evitando el obstáculo.',
 'Fix the program so Codi reaches the goal while avoiding the obstacle.',
 'Cuando un bucle tiene un error, el error se repite todas las veces que ejecuta el bucle. Esto puede causar más daño que un error normal. Por eso es importante revisar bien lo que hay dentro de un bucle antes de ejecutarlo. La depuración de bucles requiere pensar: ¿qué pasa en la primera repetición? ¿Y en la segunda? ¿El bucle se repite el número correcto de veces? Ir paso a paso mentalmente te ayuda a encontrar el error.',
 'When a loop has an error, the error repeats every time the loop runs. This can cause more damage than a normal error. That''s why it''s important to carefully check what''s inside a loop before running it. Debugging loops requires thinking: what happens in the first repetition? And the second? Does the loop repeat the correct number of times? Going through it step by step mentally helps you find the error.',
 '["Ejecuta el programa y observa qué pasa","El bucle hace que Codi choque — ¿cómo puedes evitar el obstáculo?","Necesitas rodear el obstáculo: Girar ← → Avanzar → Girar → antes de seguir"]',
 '["Run the program and watch what happens","The loop makes Codi crash — how can you avoid the obstacle?","You need to go around: Turn left → Move → Turn right before continuing"]'),

-- M8: El bosque infinito
(2, 'bosque-bucles-08', 'El bosque infinito',
 'El bosque más profundo está lleno de obstáculos y tesoros. Codi necesita llegar al otro lado usando todo lo que ha aprendido.',
 'Lleva a Codi a la meta. Bonus: recoge los hongos 🍄 en el camino.',
 'Combina todo lo aprendido: secuencias, bucles y planificación para encontrar la solución más elegante.',
 'optimization',
 '["move_forward","turn_left","turn_right","repeat","pick_item"]',
 '{"width":8,"height":5,"start":{"x":0,"y":4,"direction":"east"},"goal":{"x":7,"y":0},"goalEmoji":"🌲","obstacles":[{"x":2,"y":2},{"x":4,"y":2},{"x":6,"y":2}],"items":[{"x":1,"y":3,"id":"hongo","emoji":"🍄"},{"x":3,"y":1,"id":"hongo","emoji":"🍄"},{"x":5,"y":3,"id":"hongo","emoji":"🍄"}]}',
 '["Observa todos los obstáculos y busca un patrón","¿Hay alguna parte del camino que se repite?","Divide el camino en secciones: primero sube, luego avanza"]',
 8, true,
 'El bosque infinito', 'The infinite forest',
 'El bosque más profundo está lleno de obstáculos y tesoros. Codi necesita llegar al otro lado usando todo lo que ha aprendido. ¡Es la prueba final del Bosque de Bucles!',
 'The deepest forest is full of obstacles and treasures. Codi needs to get to the other side using everything it has learned. It''s the final test of the Loop Forest!',
 'Lleva a Codi a la meta. Bonus: recoge los hongos 🍄 en el camino.',
 'Take Codi to the goal. Bonus: collect the mushrooms 🍄 along the way.',
 'Esta es la misión más difícil del Bosque de Bucles. Aquí necesitarás combinar todo lo que has aprendido: secuencias, bucles con múltiples instrucciones, y planificación. Los mejores programas no son los que simplemente funcionan — son los que funcionan bien, son cortos, claros y eficientes. Un programador experto ve un problema complejo y lo divide en partes más pequeñas, buscando patrones en cada parte. ¿Puedes encontrar la solución más elegante?',
 'This is the hardest mission in the Loop Forest. Here you''ll need to combine everything you''ve learned: sequences, loops with multiple instructions, and planning. The best programs aren''t the ones that simply work — they''re the ones that work well, are short, clear and efficient. An expert programmer sees a complex problem and divides it into smaller parts, looking for patterns in each part. Can you find the most elegant solution?',
 '["Observa todos los obstáculos y busca un patrón","¿Hay alguna parte del camino que se repite?","Divide el camino en secciones: primero sube, luego avanza"]',
 '["Look at all the obstacles and find a pattern","Is there any part of the path that repeats?","Divide the path into sections: first go north, then east"]');

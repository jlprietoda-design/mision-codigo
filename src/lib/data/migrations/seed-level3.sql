-- ============================================================
-- Misión Código — Seed Nivel 3: Ciudad Condicional
-- Ejecutar DESPUÉS de seed-level2.sql
--
-- Activa el nivel 3 y añade sus 8 misiones con contenido bilingüe.
-- ============================================================

-- Activar el nivel 3
INSERT INTO public.levels (id, slug, title, description, emoji, world_order, is_active)
VALUES (3, 'ciudad-condicional', 'Ciudad Condicional', 'Condiciones y decisiones', '🏙️', 3, true)
ON CONFLICT (id) DO UPDATE SET is_active = true;

-- Badges de la Ciudad Condicional
INSERT INTO public.badges (slug, name, description, icon) VALUES
  ('primera-condicion',            'Primera Condición',             'Completaste tu primera misión de la Ciudad Condicional', '🚧'),
  ('ciudad-condicional-completada','Ciudad Condicional Completada', 'Completaste todas las misiones de la Ciudad Condicional', '🏙️')
ON CONFLICT (slug) DO NOTHING;

-- Borrar misiones previas del nivel 3 (seguro si no hay progreso guardado)
DELETE FROM public.missions WHERE level_id = 3;

-- Las 8 misiones del Nivel 3
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

-- M1: Mi primera condición
(3, 'ciudad-condicional-01', 'Mi primera condición',
 'Codi llega a la ciudad pero el camino principal está cortado. ¿Hay un muro? Si hay muro, Codi necesita decidir qué hacer.',
 'Lleva a Codi a la meta evitando el muro.',
 'Una condición comprueba algo del entorno y ejecuta código solo si la comprobación es verdadera.',
 'conditional',
 '["move_forward","turn_left","turn_right","if_obstacle"]',
 '{"width":3,"height":2,"start":{"x":0,"y":0,"direction":"east"},"goal":{"x":2,"y":0},"goalEmoji":"🏙️","obstacles":[{"x":1,"y":0}]}',
 '["Usa el bloque \"Si hay muro\" para detectar el obstáculo","Dentro del bloque, indica cómo esquivar: gira y rodea","Si hay muro: gira derecha, avanza, gira izquierda, avanza, avanza, gira izquierda, avanza"]',
 1, true,
 'Mi primera condición', 'My first condition',
 'Codi llega a la ciudad pero el camino principal está cortado. ¿Hay un muro? Si hay muro, Codi necesita decidir qué hacer. ¡Vamos a enseñarle a tomar decisiones!',
 'Codi reaches the city but the main road is blocked. Is there a wall? If there is a wall, Codi needs to decide what to do. Let''s teach it to make decisions!',
 'Lleva a Codi a la meta evitando el muro.', 'Take Codi to the goal, avoiding the wall.',
 'Una condición es una pregunta que el programa le hace al mundo: ¿hay un muro delante? Si la respuesta es SÍ, se ejecuta el código dentro del bloque "Si hay muro". Si la respuesta es NO, ese código se salta. Las computadoras toman millones de estas decisiones por segundo. Este bloque es el núcleo de cualquier programa inteligente.',
 'A condition is a question the program asks the world: is there a wall ahead? If the answer is YES, the code inside the "If wall ahead" block runs. If the answer is NO, that code is skipped. Computers make millions of these decisions per second. This block is the core of any intelligent program.',
 '["Usa el bloque \"Si hay muro\" para detectar el obstáculo","Dentro del bloque, indica cómo esquivar: gira y rodea","Si hay muro: gira derecha, avanza, gira izquierda, avanza, avanza, gira izquierda, avanza"]',
 '["Use the \"If wall ahead\" block to detect the obstacle","Inside the block, tell Codi how to dodge: turn and go around","If wall: turn right, move, turn left, move, move, turn left, move"]'),

-- M2: La bifurcación
(3, 'ciudad-condicional-02', 'La bifurcación',
 'Hay una bifurcación en la ciudad. Si la calle principal está cortada, Codi debe girar y tomar la calle de arriba.',
 'Llega a la meta sorteando el bloqueo.',
 'Las condiciones permiten que el programa reaccione al entorno en vez de seguir siempre los mismos pasos fijos.',
 'conditional',
 '["move_forward","turn_left","turn_right","if_obstacle"]',
 '{"width":4,"height":2,"start":{"x":0,"y":1,"direction":"east"},"goal":{"x":3,"y":0},"goalEmoji":"🏙️","obstacles":[{"x":1,"y":1}]}',
 '["Codi empieza mirando al este. ¿Qué hay justo delante?","Si hay muro: gira a la izquierda para mirar al norte","Si hay muro: gira izquierda, luego avanza, gira derecha, avanza, avanza, avanza"]',
 2, true,
 'La bifurcación', 'The fork in the road',
 'Hay una bifurcación en la ciudad. Si la calle principal está cortada, Codi debe girar y tomar la calle de arriba. ¡Una decisión rápida!',
 'There''s a fork in the city. If the main street is blocked, Codi must turn and take the upper street. A quick decision!',
 'Llega a la meta sorteando el bloqueo.', 'Reach the goal by getting past the blockade.',
 'Las condiciones permiten que tu programa reaccione al entorno. En lugar de escribir siempre los mismos pasos, el bloque "Si hay muro" hace que Codi explore y decida en el momento. Esto es lo que hace la diferencia entre un robot que solo sigue instrucciones fijas y uno que puede adaptarse a situaciones nuevas.',
 'Conditions allow your program to react to the environment. Instead of always writing the same steps, the "If wall ahead" block makes Codi explore and decide on the spot. This is what makes the difference between a robot that only follows fixed instructions and one that can adapt to new situations.',
 '["Codi empieza mirando al este. ¿Qué hay justo delante?","Si hay muro: gira a la izquierda para mirar al norte","Si hay muro: gira izquierda, luego avanza, gira derecha, avanza, avanza, avanza"]',
 '["Codi starts facing east. What''s right in front?","If wall: turn left to face north","If wall: turn left, then move, turn right, move, move, move"]'),

-- M3: La puerta de la ciudad
(3, 'ciudad-condicional-03', 'La puerta de la ciudad',
 'La meta tiene una puerta con llave. Codi debe recoger la llave y comprobar si la lleva antes de avanzar.',
 'Recoge la llave 🗝️ y llega a la meta.',
 '"Si tengo objeto" comprueba si la mochila de Codi tiene algo dentro antes de actuar.',
 'conditional',
 '["move_forward","pick_item","if_has_item"]',
 '{"width":4,"height":1,"start":{"x":0,"y":0,"direction":"east"},"goal":{"x":3,"y":0},"goalEmoji":"🏙️","items":[{"x":1,"y":0,"id":"llave","emoji":"🗝️"}],"requiredItem":"llave"}',
 '["Primero avanza hasta la llave y recógela","Luego usa \"Si tengo objeto\" para avanzar hasta la meta","Avanza, recoger, Si tengo objeto → avanza, avanza"]',
 3, true,
 'La puerta de la ciudad', 'The city gate',
 'La meta tiene una puerta con llave. Codi debe recoger la llave y usarla para entrar. Pero primero necesita comprobar si lleva la llave en la mochila.',
 'The goal has a locked gate. Codi must pick up the key and use it to enter. But first it needs to check if it has the key in its backpack.',
 'Recoge la llave 🗝️ y llega a la meta.', 'Pick up the key 🗝️ and reach the goal.',
 '"Si tengo objeto" comprueba la mochila de Codi. Si tiene algo dentro, ejecuta el código de dentro del bloque. Esto es muy útil cuando necesitas actuar de forma diferente según lo que llevas encima. Los videojuegos usan constantemente este tipo de condición: ¿tienes espada? ¿tienes llave? ¿tienes monedas suficientes?',
 '"If I have an item" checks Codi''s backpack. If there''s something inside, it runs the code within the block. This is very useful when you need to act differently depending on what you''re carrying. Video games constantly use this type of condition: do you have a sword? Do you have a key? Do you have enough coins?',
 '["Primero avanza hasta la llave y recógela","Luego usa \"Si tengo objeto\" para avanzar hasta la meta","Avanza, recoger, Si tengo objeto → avanza, avanza"]',
 '["First move to the key and pick it up","Then use \"If I have an item\" to move to the goal","Move, pick up, If I have an item → move, move"]'),

-- M4: El camino correcto
(3, 'ciudad-condicional-04', 'El camino correcto',
 'Hay una moneda en la calle. Si Codi la recoge, puede tomar el camino sur hacia la meta.',
 'Recoge la moneda 💰 y llega a la meta.',
 'Los programas eligen caminos distintos según el estado del sistema — esto se llama lógica condicional basada en el estado.',
 'conditional',
 '["move_forward","turn_left","turn_right","pick_item","if_has_item"]',
 '{"width":5,"height":2,"start":{"x":0,"y":0,"direction":"east"},"goal":{"x":4,"y":1},"goalEmoji":"🏙️","items":[{"x":2,"y":0,"id":"moneda","emoji":"💰"}]}',
 '["Avanza hasta la moneda y recógela","Con la moneda, usa \"Si tengo objeto\" para bajar y luego ir al este","Avanza, avanza, recoger, Si tengo objeto → gira derecha, avanza, gira izquierda, avanza, avanza"]',
 4, true,
 'El camino correcto', 'The right path',
 'Hay una moneda en la calle. Si Codi la recoge, puede tomar el camino sur hacia la meta.',
 'There''s a coin in the street. If Codi picks it up, it can take the south path to the goal.',
 'Recoge la moneda 💰 y llega a la meta.', 'Pick up the coin 💰 and reach the goal.',
 'Los programas pueden elegir caminos distintos según el estado del sistema. "Si tengo objeto" es una forma de verificar ese estado antes de actuar. En programación, esto se llama lógica condicional basada en el estado. Es la base de cómo funcionan los menús, los juegos, las aplicaciones y prácticamente todo lo que usas en el día a día.',
 'Programs can choose different paths depending on the state of the system. "If I have an item" is a way to check that state before acting. In programming, this is called state-based conditional logic. It''s the foundation of how menus, games, apps, and practically everything you use every day works.',
 '["Avanza hasta la moneda y recógela","Con la moneda, usa \"Si tengo objeto\" para bajar y luego ir al este","Avanza, avanza, recoger, Si tengo objeto → gira derecha, avanza, gira izquierda, avanza, avanza"]',
 '["Move to the coin and pick it up","With the coin, use \"If I have an item\" to go south then east","Move, move, pick up, If I have item → turn right, move, turn left, move, move"]'),

-- M5: La señal del suelo
(3, 'ciudad-condicional-05', 'La señal del suelo',
 'En la ciudad hay señales pintadas en el suelo. Codi debe comprobar si hay una señal bajo sus pies y seguir sus instrucciones.',
 'Sigue la señal 🚦 del suelo hasta llegar a la meta.',
 '"Si hay objeto aquí" comprueba la celda donde está Codi y ejecuta código si hay algo en el suelo.',
 'conditional',
 '["move_forward","turn_left","turn_right","if_on_item"]',
 '{"width":4,"height":2,"start":{"x":0,"y":1,"direction":"east"},"goal":{"x":3,"y":0},"goalEmoji":"🏙️","items":[{"x":1,"y":1,"id":"señal","emoji":"🚦"}]}',
 '["Avanza hasta la señal y usa \"Si hay objeto aquí\"","Dentro del bloque: gira izquierda (hacia el norte)","Avanza, Si hay objeto aquí → gira izquierda, avanza, gira derecha, avanza, avanza"]',
 5, true,
 'La señal del suelo', 'The floor signal',
 'En la ciudad hay señales pintadas en el suelo que indican por dónde girar. Codi debe comprobar si hay una señal bajo sus pies y seguir sus instrucciones.',
 'In the city there are signals painted on the floor that indicate which way to turn. Codi must check if there''s a signal under its feet and follow its instructions.',
 'Sigue la señal 🚦 del suelo hasta llegar a la meta.', 'Follow the floor signal 🚦 to reach the goal.',
 '"Si hay objeto aquí" comprueba la celda donde está Codi ahora mismo. Si hay algo en el suelo, ejecuta el código interior. Esto permite que el programa reaccione a lo que hay en el entorno inmediato, sin necesidad de recogerlo. Imagina robots de almacén que detectan marcas en el suelo y cambian de dirección automáticamente: exactamente este mismo mecanismo.',
 '"If item here" checks the cell where Codi is right now. If there''s something on the ground, it runs the inner code. This lets the program react to what''s in the immediate environment, without needing to pick it up. Imagine warehouse robots that detect floor markings and change direction automatically: exactly the same mechanism.',
 '["Avanza hasta la señal y usa \"Si hay objeto aquí\"","Dentro del bloque: gira izquierda (hacia el norte)","Avanza, Si hay objeto aquí → gira izquierda, avanza, gira derecha, avanza, avanza"]',
 '["Move to the signal and use \"If item here\"","Inside the block: turn left (to face north)","Move, If item here → turn left, move, turn right, move, move"]'),

-- M6: Dos señales
(3, 'ciudad-condicional-06', 'Dos señales',
 'La ciudad tiene dos señales en el suelo que forman una ruta. Codi debe seguirlas en orden.',
 'Sigue las dos señales 🚦 para llegar a la meta.',
 'Un programa puede comprobar la misma condición varias veces con instrucciones distintas dentro de cada bloque.',
 'conditional',
 '["move_forward","turn_left","turn_right","if_on_item"]',
 '{"width":4,"height":3,"start":{"x":0,"y":2,"direction":"east"},"goal":{"x":3,"y":0},"goalEmoji":"🏙️","items":[{"x":1,"y":2,"id":"señal","emoji":"🚦"},{"x":1,"y":0,"id":"señal","emoji":"🚦"}]}',
 '["La primera señal está en (1,2) — avanza hasta ella","En la primera señal: gira izquierda (norte). En la segunda: gira derecha (este)","Avanza, Si objeto→gira izquierda, avanza, avanza, Si objeto→gira derecha, avanza, avanza"]',
 6, true,
 'Dos señales', 'Two signals',
 'La ciudad tiene dos señales en el suelo que forman una ruta. Codi debe seguirlas en orden para llegar a la meta. ¡Cada señal le da una instrucción diferente!',
 'The city has two floor signals that form a route. Codi must follow them in order to reach the goal. Each signal gives a different instruction!',
 'Sigue las dos señales 🚦 para llegar a la meta.', 'Follow both signals 🚦 to reach the goal.',
 'Un programa puede comprobar condiciones varias veces a lo largo de su ejecución. Cada "Si hay objeto aquí" es una comprobación independiente en un momento diferente. El mismo tipo de bloque puede hacer cosas distintas dependiendo de cuándo se ejecuta y qué instrucciones tiene dentro. Esto es el poder de la programación: reutilizar estructuras con contenidos diferentes.',
 'A program can check conditions multiple times throughout its execution. Each "If item here" is an independent check at a different moment. The same type of block can do different things depending on when it runs and what instructions it contains. This is the power of programming: reusing structures with different contents.',
 '["La primera señal está en (1,2) — avanza hasta ella","En la primera señal: gira izquierda (norte). En la segunda: gira derecha (este)","Avanza, Si objeto→gira izquierda, avanza, avanza, Si objeto→gira derecha, avanza, avanza"]',
 '["The first signal is at (1,2) — move to it","At the first signal: turn left (north). At the second: turn right (east)","Move, If item→turn left, move, move, If item→turn right, move, move"]'),

-- M7: Condición y bucle
(3, 'ciudad-condicional-07', 'Condición y bucle',
 'La ciudad es grande y Codi necesita combinar condiciones y bucles. Primero detecta el muro para girar, luego usa un bucle para recorrer la calle larga.',
 'Combina "Si hay muro" y "Repetir" para llegar a la meta.',
 'Condiciones y bucles se combinan constantemente en programas reales: la condición decide la dirección y el bucle hace el trabajo repetitivo.',
 'conditional',
 '["move_forward","turn_left","turn_right","if_obstacle","repeat"]',
 '{"width":4,"height":2,"start":{"x":0,"y":1,"direction":"east"},"goal":{"x":3,"y":0},"goalEmoji":"🏙️","obstacles":[{"x":1,"y":1}]}',
 '["Primero usa \"Si hay muro\" para girar la dirección correcta","Luego usa Repetir para avanzar varios pasos de una vez","Si hay muro → gira izquierda, avanza, gira derecha, luego Repetir(3) → avanza"]',
 7, true,
 'Condición y bucle', 'Condition and loop',
 'La ciudad es grande y Codi necesita combinar sus nuevas habilidades. Primero detecta el muro para girar, luego usa un bucle para recorrer la calle larga.',
 'The city is big and Codi needs to combine its new skills. First it detects the wall to turn, then uses a loop to travel the long street.',
 'Combina "Si hay muro" y "Repetir" para llegar a la meta.', 'Combine "If wall ahead" and "Repeat" to reach the goal.',
 'Los programadores combinan condiciones y bucles todo el tiempo. Una condición decide la dirección y un bucle hace el trabajo repetitivo. Juntos, forman programas potentes que pueden manejar situaciones complejas con muy pocos bloques. Esta combinación aparece en robots, videojuegos, aplicaciones y sistemas de navegación.',
 'Programmers combine conditions and loops all the time. A condition decides the direction and a loop does the repetitive work. Together, they form powerful programs that can handle complex situations with very few blocks. This combination appears in robots, video games, apps, and navigation systems.',
 '["Primero usa \"Si hay muro\" para girar la dirección correcta","Luego usa Repetir para avanzar varios pasos de una vez","Si hay muro → gira izquierda, avanza, gira derecha, luego Repetir(3) → avanza"]',
 '["First use \"If wall ahead\" to turn the right direction","Then use Repeat to move several steps at once","If wall → turn left, move, turn right, then Repeat(3) → move"]'),

-- M8: El gran desafío
(3, 'ciudad-condicional-08', 'El gran desafío',
 'La misión final. Hay un muro en la salida y una estrella mágica que debes recoger. Usa todo lo aprendido.',
 'Sortea el muro, recoge la estrella ⭐ y llega a la meta.',
 'Los mejores programas combinan condiciones, recogida de objetos y secuencias para resolver situaciones complejas con pocos bloques.',
 'conditional',
 '["move_forward","turn_left","turn_right","pick_item","if_obstacle","if_on_item"]',
 '{"width":4,"height":3,"start":{"x":0,"y":2,"direction":"east"},"goal":{"x":3,"y":0},"goalEmoji":"🏙️","obstacles":[{"x":1,"y":2}],"items":[{"x":2,"y":0,"id":"estrella","emoji":"⭐"}],"allItemsRequired":true}',
 '["Primero rodea el muro yendo al norte","Luego avanza este hasta la estrella y comprueba si estás encima de ella","Si hay muro → gira norte, avanza, avanza, gira este; avanza, avanza; Si hay objeto → recoger; avanza"]',
 8, true,
 'El gran desafío', 'The grand challenge',
 '¡La misión final de la Ciudad Condicional! Hay un muro en la salida y una estrella mágica que debes recoger antes de llegar a la meta. Usa todas tus habilidades.',
 'The final mission of Conditional City! There''s a wall at the exit and a magic star you must collect before reaching the goal. Use all your skills.',
 'Sortea el muro, recoge la estrella ⭐ y llega a la meta.', 'Get past the wall, collect the star ⭐, and reach the goal.',
 'Los mejores programas combinan todo lo aprendido. Aquí usas "Si hay muro" para esquivar el obstáculo, "Si hay objeto aquí" para recoger la estrella cuando estés encima de ella, y secuencias para conectar todo. Un programador experto no memoriza soluciones: entrena su mente para ver el problema, elegir las herramientas correctas y combinarlas de forma elegante. ¡Tú ya puedes hacerlo!',
 'The best programs combine everything learned. Here you use "If wall ahead" to dodge the obstacle, "If item here" to pick up the star when you''re on top of it, and sequences to connect everything. An expert programmer doesn''t memorize solutions: they train their mind to see the problem, choose the right tools, and combine them elegantly. You can already do this!',
 '["Primero rodea el muro yendo al norte","Luego avanza este hasta la estrella y comprueba si estás encima de ella","Si hay muro → gira norte, avanza, avanza, gira este; avanza, avanza; Si hay objeto → recoger; avanza"]',
 '["First go around the wall heading north","Then head east to the star and check if you''re standing on it","If wall → turn north, move, move, turn east; move, move; If item → pick up; move"]');

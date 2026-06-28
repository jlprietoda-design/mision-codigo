import type { MapConfig } from '@/lib/mission-engine/types'

export interface MissionData {
  id: string
  title: string
  story: string
  objective: string
  concept: string
  levelId: number
  order: number
  mapConfig: MapConfig
  availableBlocks: string[]
  hints: string[]
}

export const MISSIONS: MissionData[] = [
  // ── Nivel 0: Primeros Pasos ─────────────────────────────────
  {
    id: 'primeros-pasos-01',
    title: 'Despierta a Codi',
    story:
      'Codi acaba de encenderse. Sus baterías están casi vacías y necesita llegar a la estación de carga antes de apagarse.',
    objective: 'Lleva a Codi hasta la batería 🔋',
    concept:
      'Un ordenador ejecuta instrucciones una a una, en el orden en que las escribes.',
    levelId: 0,
    order: 1,
    mapConfig: {
      width: 3,
      height: 1,
      start: { x: 0, y: 0, direction: 'east' },
      goal: { x: 2, y: 0 },
    },
    availableBlocks: ['move_forward'],
    hints: [
      '¿Qué bloque hace que Codi avance hacia adelante?',
      'Codi necesita avanzar más de una vez.',
      'Añade el bloque Avanzar dos veces seguidas.',
    ],
  },
  {
    id: 'primeros-pasos-02',
    title: 'Avanza hasta la batería',
    story:
      '¡Bien hecho! Pero Codi necesita más energía. Esta vez la batería está más lejos. ¡Tú puedes!',
    objective: 'Lleva a Codi hasta la batería 🔋',
    concept:
      'Puedes usar el mismo bloque varias veces seguidas. Las instrucciones se repiten.',
    levelId: 0,
    order: 2,
    mapConfig: {
      width: 4,
      height: 1,
      start: { x: 0, y: 0, direction: 'east' },
      goal: { x: 3, y: 0 },
    },
    availableBlocks: ['move_forward'],
    hints: [
      'Codi empieza en el extremo izquierdo.',
      'Cuenta cuántos pasos hay hasta la batería.',
      'Añade el bloque Avanzar tres veces.',
    ],
  },
  {
    id: 'primeros-pasos-03',
    title: 'Gira y avanza',
    story:
      'El camino ya no es recto. Codi tiene que doblar una esquina para llegar a su base de carga. ¡Aprende a girar!',
    objective: 'Lleva a Codi hasta la batería doblando la esquina 🔋',
    concept:
      'Los robots pueden girar a la izquierda o a la derecha para cambiar de dirección.',
    levelId: 0,
    order: 3,
    mapConfig: {
      width: 3,
      height: 3,
      start: { x: 0, y: 2, direction: 'east' },
      goal: { x: 2, y: 0 },
    },
    availableBlocks: ['move_forward', 'turn_left', 'turn_right'],
    hints: [
      'Primero, Codi debe avanzar hacia la derecha.',
      'Cuando llegue a la esquina, necesita girar para subir.',
      'Avanza 2 veces, luego Girar ←, luego avanza 2 veces más.',
    ],
  },
  {
    id: 'primeros-pasos-04',
    title: 'Cuidado con la roca',
    story:
      'Una roca enorme bloquea el camino directo. Codi tendrá que rodearla para llegar a la batería. ¡Planifica bien!',
    objective: 'Lleva a Codi hasta la batería esquivando la roca 🔋',
    concept:
      'Un buen programa prevé los obstáculos y planifica un camino alternativo.',
    levelId: 0,
    order: 4,
    mapConfig: {
      width: 5,
      height: 3,
      start: { x: 0, y: 1, direction: 'east' },
      goal: { x: 4, y: 1 },
      obstacles: [{ x: 2, y: 1 }],
    },
    availableBlocks: ['move_forward', 'turn_left', 'turn_right'],
    hints: [
      'La roca está en el camino directo. Tendrás que pasar por arriba o por abajo.',
      'Intenta subir una fila antes de llegar a donde está la roca.',
      'Avanza 1, Girar ←, avanza 1, Girar →, avanza 2, Girar →, avanza 1, Girar ←, avanza 1.',
    ],
  },
  {
    id: 'primeros-pasos-05',
    title: 'El camino a la nave',
    story:
      'La nave de Codi está en la esquina opuesta del campo. Hay rocas por el camino. ¡Planifica bien la ruta antes de ejecutar!',
    objective: 'Lleva a Codi hasta la nave espacial 🔋',
    concept:
      'Planificar un programa significa pensar todos los pasos antes de ejecutarlos.',
    levelId: 0,
    order: 5,
    mapConfig: {
      width: 5,
      height: 5,
      start: { x: 0, y: 4, direction: 'east' },
      goal: { x: 4, y: 0 },
      obstacles: [{ x: 2, y: 2 }, { x: 3, y: 2 }],
    },
    availableBlocks: ['move_forward', 'turn_left', 'turn_right'],
    hints: [
      '¿Puedes encontrar un camino que no pase por las rocas?',
      'Intenta ir por los bordes del mapa, donde no hay obstáculos.',
      'Avanza 4 veces, luego Girar ←, luego avanza 4 veces.',
    ],
  },
]

export function getMissionById(id: string): MissionData | undefined {
  return MISSIONS.find((m) => m.id === id)
}

export function getNextMission(currentId: string): MissionData | undefined {
  const idx = MISSIONS.findIndex((m) => m.id === currentId)
  return idx !== -1 ? MISSIONS[idx + 1] : undefined
}

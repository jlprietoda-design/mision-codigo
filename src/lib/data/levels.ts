export type LevelStatus = 'locked' | 'available' | 'in_progress' | 'completed'

export interface LevelData {
  id: number
  slug: string
  title: string
  emoji: string
  world_order: number
  status: LevelStatus
  firstMissionSlug?: string
}

export const LEVELS: LevelData[] = [
  {
    id: 0,
    slug: 'primeros-pasos',
    title: 'Primeros Pasos',
    emoji: '🚀',
    world_order: 0,
    status: 'completed',
  },
  {
    id: 1,
    slug: 'isla-logica',
    title: 'Isla Lógica',
    emoji: '🏝️',
    world_order: 1,
    status: 'in_progress',
  },
  {
    id: 2,
    slug: 'bosque-bucles',
    title: 'Bosque de Bucles',
    emoji: '🌲',
    world_order: 2,
    status: 'available',
  },
  {
    id: 3,
    slug: 'ciudad-condicional',
    title: 'Ciudad Condicional',
    emoji: '🏙️',
    world_order: 3,
    status: 'locked',
  },
  {
    id: 4,
    slug: 'parque-eventos',
    title: 'Parque de Eventos',
    emoji: '⚡',
    world_order: 4,
    status: 'locked',
  },
  {
    id: 5,
    slug: 'banco-energia',
    title: 'Banco de Energía',
    emoji: '🏦',
    world_order: 5,
    status: 'locked',
  },
  {
    id: 6,
    slug: 'fabrica-hechizos',
    title: 'Fábrica de Hechizos',
    emoji: '🧙',
    world_order: 6,
    status: 'locked',
  },
  {
    id: 7,
    slug: 'tierra-algoritmica',
    title: 'Tierra Algorítmica',
    emoji: '👑',
    world_order: 7,
    status: 'locked',
  },
  {
    id: 8,
    slug: 'galaxia-digital',
    title: 'Galaxia Digital',
    emoji: '🌌',
    world_order: 8,
    status: 'locked',
  },
  {
    id: 9,
    slug: 'laboratorio-ia',
    title: 'Laboratorio IA',
    emoji: '🤖',
    world_order: 9,
    status: 'locked',
  },
  {
    id: 10,
    slug: 'codigo-real',
    title: 'Código Real',
    emoji: '💻',
    world_order: 10,
    status: 'locked',
  },
]

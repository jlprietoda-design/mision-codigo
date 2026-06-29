export type LevelStatus = 'locked' | 'available' | 'in_progress' | 'completed'

export interface LevelData {
  id: number
  slug: string
  title: string      // alias for title_es — kept for backward compat
  title_es: string
  title_en: string
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
    title_es: 'Primeros Pasos',
    title_en: 'First Steps',
    emoji: '🚀',
    world_order: 0,
    status: 'completed',
  },
  {
    id: 1,
    slug: 'isla-logica',
    title: 'Isla Lógica',
    title_es: 'Isla Lógica',
    title_en: 'Logic Island',
    emoji: '🏝️',
    world_order: 1,
    status: 'in_progress',
    firstMissionSlug: 'isla-logica-01',
  },
  {
    id: 2,
    slug: 'bosque-bucles',
    title: 'Bosque de Bucles',
    title_es: 'Bosque de Bucles',
    title_en: 'Loop Forest',
    emoji: '🌲',
    world_order: 2,
    status: 'available',
  },
  {
    id: 3,
    slug: 'ciudad-condicional',
    title: 'Ciudad Condicional',
    title_es: 'Ciudad Condicional',
    title_en: 'Conditional City',
    emoji: '🏙️',
    world_order: 3,
    status: 'locked',
  },
  {
    id: 4,
    slug: 'parque-eventos',
    title: 'Parque de Eventos',
    title_es: 'Parque de Eventos',
    title_en: 'Events Park',
    emoji: '⚡',
    world_order: 4,
    status: 'locked',
  },
  {
    id: 5,
    slug: 'banco-energia',
    title: 'Banco de Energía',
    title_es: 'Banco de Energía',
    title_en: 'Energy Bank',
    emoji: '🏦',
    world_order: 5,
    status: 'locked',
  },
  {
    id: 6,
    slug: 'fabrica-hechizos',
    title: 'Fábrica de Hechizos',
    title_es: 'Fábrica de Hechizos',
    title_en: 'Spell Factory',
    emoji: '🧙',
    world_order: 6,
    status: 'locked',
  },
  {
    id: 7,
    slug: 'tierra-algoritmica',
    title: 'Tierra Algorítmica',
    title_es: 'Tierra Algorítmica',
    title_en: 'Character Lab',
    emoji: '👑',
    world_order: 7,
    status: 'locked',
  },
  {
    id: 8,
    slug: 'galaxia-digital',
    title: 'Galaxia Digital',
    title_es: 'Galaxia Digital',
    title_en: 'Algorithm Tower',
    emoji: '🌌',
    world_order: 8,
    status: 'locked',
  },
  {
    id: 9,
    slug: 'laboratorio-ia',
    title: 'Laboratorio IA',
    title_es: 'Laboratorio IA',
    title_en: 'AI Laboratory',
    emoji: '🤖',
    world_order: 9,
    status: 'locked',
  },
  {
    id: 10,
    slug: 'codigo-real',
    title: 'Código Real',
    title_es: 'Código Real',
    title_en: 'Real Code',
    emoji: '💻',
    world_order: 10,
    status: 'locked',
  },
]

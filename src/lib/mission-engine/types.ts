export type GridCellType = 'empty' | 'wall' | 'goal' | 'item' | 'start'

export interface GridCell {
  type: GridCellType
  item?: string
}

export type Grid = GridCell[][]

export type Direction = 'north' | 'east' | 'south' | 'west'

export interface PlayerState {
  x: number
  y: number
  direction: Direction
  inventory: string[]
  score: number
}

export interface Block {
  type: string
  times?: number
  children?: Block[]
}

export interface ExecutionStep {
  playerState: PlayerState
  message?: string
  collected?: string
}

export interface ExecutionResult {
  success: boolean
  message: string
  steps: ExecutionStep[]
  hintsTriggered?: string[]
  errorType?: 'collision' | 'out_of_bounds' | 'goal_not_reached' | 'timeout'
}

export interface MapConfig {
  width: number
  height: number
  start: { x: number; y: number; direction: Direction }
  goal: { x: number; y: number }
  goalEmoji?: string
  obstacles?: { x: number; y: number }[]
  items?: { x: number; y: number; id: string; emoji?: string }[]
  requiredItem?: string
  allItemsRequired?: boolean
}

import type { Block, Direction, ExecutionResult, ExecutionStep, MapConfig, PlayerState } from './types'

const MAX_STEPS = 100

const DELTA: Record<Direction, { dx: number; dy: number }> = {
  north: { dx: 0, dy: -1 },
  east: { dx: 1, dy: 0 },
  south: { dx: 0, dy: 1 },
  west: { dx: -1, dy: 0 },
}

const TURN_LEFT: Record<Direction, Direction> = {
  north: 'west',
  west: 'south',
  south: 'east',
  east: 'north',
}

const TURN_RIGHT: Record<Direction, Direction> = {
  north: 'east',
  east: 'south',
  south: 'west',
  west: 'north',
}

export function executeMission(blocks: Block[], mapConfig: MapConfig): ExecutionResult {
  // Build obstacle set for O(1) lookup
  const wallSet = new Set<string>()
  for (const obs of mapConfig.obstacles ?? []) {
    wallSet.add(`${obs.x},${obs.y}`)
  }

  // Track items remaining on map
  const itemsOnMap = new Map<string, { x: number; y: number; id: string }>()
  for (const item of mapConfig.items ?? []) {
    itemsOnMap.set(`${item.x},${item.y}`, item)
  }

  let player: PlayerState = {
    x: mapConfig.start.x,
    y: mapConfig.start.y,
    direction: mapConfig.start.direction,
    inventory: [],
    score: 0,
  }

  const steps: ExecutionStep[] = []
  // Initial state before any instruction runs
  steps.push({ playerState: clone(player) })

  let stepCount = 0
  let earlyResult: ExecutionResult | null = null

  function clone(p: PlayerState): PlayerState {
    return { ...p, inventory: [...p.inventory] }
  }

  function push(message?: string, collected?: string) {
    steps.push({ playerState: clone(player), message, collected })
  }

  function run(block: Block): boolean {
    if (earlyResult) return false

    // ── move_forward ──────────────────────────────────────────
    if (block.type === 'move_forward') {
      if (stepCount >= MAX_STEPS) {
        earlyResult = {
          success: false,
          message: 'Codi estuvo moviéndose demasiado tiempo. ¡Revisa cuántos pasos tiene tu programa!',
          steps,
          errorType: 'timeout' as const,
        }
        return false
      }
      stepCount++

      const { dx, dy } = DELTA[player.direction]
      const nx = player.x + dx
      const ny = player.y + dy

      if (nx < 0 || nx >= mapConfig.width || ny < 0 || ny >= mapConfig.height) {
        push('¡Fuera del mapa!')
        earlyResult = {
          success: false,
          message: '¡Codi se salió del mapa! Asegúrate de que no se caiga por los bordes.',
          steps,
          errorType: 'out_of_bounds' as const,
        }
        return false
      }

      if (wallSet.has(`${nx},${ny}`)) {
        push('¡Choque!')
        earlyResult = {
          success: false,
          message: '¡Codi chocó con algo! Revisa el camino y evita los obstáculos.',
          steps,
          errorType: 'collision' as const,
        }
        return false
      }

      player.x = nx
      player.y = ny

      if (nx === mapConfig.goal.x && ny === mapConfig.goal.y) {
        push('¡Meta alcanzada!')
        earlyResult = {
          success: true,
          message: '¡Misión superada! ¡Lo conseguiste!',
          steps,
        }
        return false // stop — mission complete
      }

      const itemKey = `${nx},${ny}`
      const item = itemsOnMap.get(itemKey)
      if (item) {
        player.inventory.push(item.id)
        itemsOnMap.delete(itemKey)
        push(undefined, item.id)
      } else {
        push()
      }
      return true
    }

    // ── turn_left ─────────────────────────────────────────────
    if (block.type === 'turn_left') {
      stepCount++
      player.direction = TURN_LEFT[player.direction]
      push()
      return true
    }

    // ── turn_right ────────────────────────────────────────────
    if (block.type === 'turn_right') {
      stepCount++
      player.direction = TURN_RIGHT[player.direction]
      push()
      return true
    }

    // ── pick_item ─────────────────────────────────────────────
    if (block.type === 'pick_item') {
      stepCount++
      const itemKey = `${player.x},${player.y}`
      const item = itemsOnMap.get(itemKey)
      if (item) {
        player.inventory.push(item.id)
        itemsOnMap.delete(itemKey)
        push(undefined, item.id)
      } else {
        push('Aquí no hay nada que recoger.')
      }
      return true
    }

    // ── use_item ──────────────────────────────────────────────
    if (block.type === 'use_item') {
      stepCount++
      if (player.inventory.length > 0) {
        const item = player.inventory.shift()!
        player.score += 10
        push(`Usó: ${item}`)
      } else {
        push('No tienes objetos para usar.')
      }
      return true
    }

    // ── repeat ────────────────────────────────────────────────
    if (block.type === 'repeat') {
      const times = Math.max(0, Math.min(block.times ?? 1, 20))
      const children = block.children ?? []
      for (let i = 0; i < times; i++) {
        for (const child of children) {
          if (!run(child) || earlyResult) return false
        }
      }
      return true
    }

    // Unknown block — skip silently
    return true
  }

  for (const block of blocks) {
    if (!run(block) || earlyResult) break
  }

  if (earlyResult) return earlyResult

  // All blocks executed but goal never reached
  return {
    success: false,
    message: 'Codi no llegó a la meta. ¿Le faltan pasos? ¿Va en la dirección correcta?',
    steps,
    errorType: 'goal_not_reached' as const,
  }
}

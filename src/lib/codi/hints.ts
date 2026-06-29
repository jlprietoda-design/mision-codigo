import { MISSIONS } from '@/lib/data/missions'
import type { ExecutionResult } from '@/lib/mission-engine/types'

const ENCOURAGEMENT_ES = [
  '¡Casi lo tienes! ¡Tú puedes!',
  '¡No te rindas! Los mejores programadores lo intentan muchas veces.',
  '¡Cada intento te acerca más a la solución!',
]
const ENCOURAGEMENT_EN = [
  "You're almost there! You can do it!",
  "Don't give up! The best programmers try many times.",
  'Every attempt gets you closer to the solution!',
]

const ERROR_HINTS_ES: Record<NonNullable<ExecutionResult['errorType']>, string> = {
  collision: '¡Codi chocó! Revisa el mapa: ¿hay un obstáculo bloqueando el camino?',
  out_of_bounds: '¡Codi se cayó del borde! Cuenta las casillas del mapa antes de avanzar.',
  goal_not_reached: 'Codi se quedó a mitad del camino. ¿Le faltan instrucciones al programa?',
  timeout: 'El programa tiene demasiados pasos. ¿Hay algún bloque que se repite de más?',
}

const ERROR_HINTS_EN: Record<NonNullable<ExecutionResult['errorType']>, string> = {
  collision: 'Codi crashed! Check the map: is there an obstacle blocking the path?',
  out_of_bounds: "Codi fell off the edge! Count the grid cells before moving.",
  goal_not_reached: "Codi stopped halfway. Does the program need more instructions?",
  timeout: 'The program has too many steps. Is any block repeating too many times?',
}

export function getContextualHint(
  missionSlug: string,
  attemptCount: number,
  lastError: ExecutionResult['errorType'] | null,
  hintsUsed: number,
  locale: string,
): string {
  const isEn = locale === 'en'
  const mission = MISSIONS.find((m) => m.id === missionSlug)
  const missionHints = mission ? (isEn ? mission.hints_en : mission.hints_es) : []

  const prefix =
    attemptCount >= 5
      ? (isEn ? ENCOURAGEMENT_EN : ENCOURAGEMENT_ES)[attemptCount % 3] + ' '
      : ''

  if (lastError && lastError !== 'goal_not_reached') {
    const errorHints = isEn ? ERROR_HINTS_EN : ERROR_HINTS_ES
    return prefix + errorHints[lastError]
  }

  const hint = missionHints[hintsUsed] ?? missionHints[missionHints.length - 1]
  if (hint) return prefix + hint

  return isEn
    ? prefix + 'Think step by step: where does Codi start, and where does it need to go?'
    : prefix + 'Piensa paso a paso: ¿dónde empieza Codi y adónde tiene que llegar?'
}

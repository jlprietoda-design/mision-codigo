'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LEVELS, type LevelData, type LevelStatus } from '@/lib/data/levels'
import { MISSIONS } from '@/lib/data/missions'
import { WorldNode } from './WorldNode'
import { MissionListPanel, type MissionSummary, type MissionProgressMap } from './MissionListPanel'
import { useProfileStore } from '@/stores/profileStore'
import { getProgressMap } from '@/app/actions/progress'

// ── Serpentine map layout ─────────────────────────────────────────────────────
type GridRow = (LevelData | null)[]
type ConnectorSide = 'left' | 'right'

const MAP_ROWS: GridRow[] = [
  [LEVELS[0], LEVELS[1], LEVELS[2]],
  [LEVELS[5], LEVELS[4], LEVELS[3]],
  [LEVELS[6], LEVELS[7], LEVELS[8]],
  [null, LEVELS[10], LEVELS[9]],
]
const CONNECTORS: ConnectorSide[] = ['right', 'left', 'right']

function HConnector({ between }: { between: [LevelData | null, LevelData | null] }) {
  const [a, b] = between
  if (!a || !b) return <div className="w-3" />
  const bothDone = a.status === 'completed' && b.status === 'completed'
  const anyActive = a.status !== 'locked' && b.status !== 'locked'
  return (
    <div
      className={[
        'h-[3px] w-8 rounded-full self-center',
        bothDone ? 'bg-[#FFD700]/70' : anyActive ? 'bg-[#534AB7]/70' : 'bg-slate-700',
      ].join(' ')}
    />
  )
}

function VConnector({
  side,
  above,
  below,
}: {
  side: ConnectorSide
  above: LevelData | null
  below: LevelData | null
}) {
  const bothDone = above?.status === 'completed' && below?.status === 'completed'
  const anyActive =
    (above?.status ?? 'locked') !== 'locked' && (below?.status ?? 'locked') !== 'locked'
  const lineColor = bothDone
    ? 'bg-[#FFD700]/70'
    : anyActive
      ? 'bg-[#534AB7]/60'
      : 'bg-slate-700'

  return (
    <div className="grid grid-cols-3 h-8 w-full">
      <div className="flex justify-center">
        {side === 'left' && <div className={`w-[3px] h-full rounded-full ${lineColor}`} />}
      </div>
      <div />
      <div className="flex justify-center">
        {side === 'right' && <div className={`w-[3px] h-full rounded-full ${lineColor}`} />}
      </div>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildMissionsForLevel(levelId: number): MissionSummary[] {
  return MISSIONS.filter((m) => m.levelId === levelId).map((m) => ({
    id: m.id,
    slug: m.id,
    title: m.title,
    objective: m.objective,
    world_order: m.order,
  }))
}

const DEFAULT_SELECTED = LEVELS.find((l) => l.status === 'in_progress')?.id ?? 0

// ── MapaClient ────────────────────────────────────────────────────────────────

export function MapaClient() {
  const [progressMap, setProgressMap] = useState<MissionProgressMap>({})

  const activeProfile = useProfileStore((s) => s.activeProfile)
  // Persists across navigation so returning from a mission restores the last selected level
  const storedLevelId = useProfileStore((s) => s.selectedLevelId)
  const setSelectedLevelId = useProfileStore((s) => s.setSelectedLevelId)

  const selectedLevelId = storedLevelId ?? DEFAULT_SELECTED

  useEffect(() => {
    if (!activeProfile?.id) return
    getProgressMap(activeProfile.id).then(setProgressMap)
  }, [activeProfile?.id])

  const selectedLevel = LEVELS.find((l) => l.id === selectedLevelId) ?? LEVELS[0]
  const missionsForLevel = buildMissionsForLevel(selectedLevelId)

  const inProgressLevel = LEVELS.find((l) => l.status === 'in_progress') ?? LEVELS[0]

  function handleNodeSelect(levelId: number) {
    setSelectedLevelId(levelId)
  }

  return (
    <div className="relative z-10 flex flex-col lg:flex-row h-screen bg-[#0d0d1a]/85 overflow-hidden">

      {/* ── Left column: world map (60%) ─────────────────────── */}
      <div className="lg:w-3/5 w-full flex flex-col min-h-0 overflow-y-auto">
        {/* Header */}
        <div className="flex-shrink-0 px-4 pt-8 pb-6 text-center">
          <h1 className="text-3xl font-bold text-white">Mapa de Mundos</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Ahora en:{' '}
            <span className="text-[#534AB7] font-semibold">
              {inProgressLevel.emoji} {inProgressLevel.title}
            </span>
          </p>
        </div>

        {/* Serpentine map */}
        <div className="flex-1 flex items-center justify-center px-4 pb-8">
          <div className="flex flex-col-reverse gap-0 w-full max-w-xs">
            {MAP_ROWS.map((row, rowIdx) => {
              const connectorAbove =
                rowIdx < MAP_ROWS.length - 1 ? CONNECTORS[rowIdx] : null
              const nextRow = connectorAbove ? MAP_ROWS[rowIdx + 1] : null
              const rowEnd =
                connectorAbove === 'left'
                  ? (row[0] ?? row[1] ?? row[2])
                  : (row[2] ?? row[1] ?? row[0])
              const nextRowStart = nextRow
                ? connectorAbove === 'left'
                  ? (nextRow[0] ?? nextRow[1] ?? nextRow[2])
                  : (nextRow[2] ?? nextRow[1] ?? nextRow[0])
                : null

              return (
                <div key={rowIdx}>
                  {connectorAbove && (
                    <VConnector
                      side={connectorAbove}
                      above={nextRowStart}
                      below={rowEnd}
                    />
                  )}
                  <div className="grid grid-cols-3 gap-2 items-start justify-items-center">
                    {row.map((level, colIdx) =>
                      level ? (
                        <div key={level.id} className="flex items-center gap-1">
                          <WorldNode
                            level={level}
                            status={level.status}
                            onSelect={handleNodeSelect}
                            isSelected={level.id === selectedLevelId}
                          />
                          {colIdx < row.length - 1 && row[colIdx + 1] && (
                            <HConnector between={[level, row[colIdx + 1]]} />
                          )}
                        </div>
                      ) : (
                        <div
                          key={`empty-${rowIdx}-${colIdx}`}
                          className="w-[72px] h-[72px]"
                        />
                      )
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 pb-6 text-center">
          <Link
            href="/app/familia"
            className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
          >
            ← Cambiar aventurero
          </Link>
        </div>
      </div>

      {/* ── Right column: mission panel (40%) ────────────────── */}
      <div className="lg:w-2/5 w-full lg:h-full lg:border-t-0 border-t border-[#534AB7]/20 min-h-[320px] lg:min-h-0">
        <MissionListPanel
          missions={missionsForLevel}
          progressMap={progressMap}
          levelTitle={selectedLevel.title}
          levelEmoji={selectedLevel.emoji}
          levelStatus={selectedLevel.status as LevelStatus}
        />
      </div>
    </div>
  )
}

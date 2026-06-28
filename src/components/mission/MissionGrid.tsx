'use client'

import { useEffect, useRef, useState } from 'react'
import type { Direction, ExecutionStep, MapConfig } from '@/lib/mission-engine/types'

const CELL_GAP = 4

const DIR_ROTATION: Record<Direction, number> = {
  east: 0,
  south: 90,
  west: 180,
  north: 270,
}

interface Props {
  mapConfig: MapConfig
  currentStep: ExecutionStep | null
  /** IDs of items collected up to (and including) the current step */
  collectedItemIds: string[]
}

export function MissionGrid({ mapConfig, currentStep, collectedItemIds }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [cellSize, setCellSize] = useState(64)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    function measure() {
      const { width, height } = el!.getBoundingClientRect()
      const pad = 48
      const maxW = Math.floor((width - pad - (mapConfig.width - 1) * CELL_GAP) / mapConfig.width)
      const maxH = Math.floor((height - pad - (mapConfig.height - 1) * CELL_GAP) / mapConfig.height)
      setCellSize(Math.max(48, Math.min(80, maxW, maxH)))
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [mapConfig.width, mapConfig.height])

  const player = currentStep?.playerState ?? {
    x: mapConfig.start.x,
    y: mapConfig.start.y,
    direction: mapConfig.start.direction,
    inventory: [],
    score: 0,
  }

  const gridW = mapConfig.width * cellSize + (mapConfig.width - 1) * CELL_GAP
  const gridH = mapConfig.height * cellSize + (mapConfig.height - 1) * CELL_GAP

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center p-6">
      <div className="relative" style={{ width: gridW, height: gridH }}>

        {/* ── Grid cells ─────────────────────────────────────── */}
        <div
          className="absolute inset-0"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${mapConfig.width}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${mapConfig.height}, ${cellSize}px)`,
            gap: CELL_GAP,
          }}
        >
          {Array.from({ length: mapConfig.height }, (_, y) =>
            Array.from({ length: mapConfig.width }, (_, x) => {
              const isGoal = x === mapConfig.goal.x && y === mapConfig.goal.y
              const isWall = mapConfig.obstacles?.some((o) => o.x === x && o.y === y) ?? false
              const isStart = x === mapConfig.start.x && y === mapConfig.start.y && !isGoal
              const item = mapConfig.items?.find(
                (i) => i.x === x && i.y === y && !collectedItemIds.includes(i.id)
              )

              return (
                <div
                  key={`${x}-${y}`}
                  className={[
                    'rounded-xl flex items-center justify-center relative overflow-hidden',
                    isWall
                      ? 'bg-[#2d2d3a] border-2 border-[#3d3d4a]'
                      : isGoal
                        ? 'bg-[#0a2518] border-2 border-[#00d4a1]/70 shadow-[inset_0_0_12px_rgba(0,212,161,0.2)]'
                        : 'bg-[#181828] border border-[#534AB7]/25',
                  ].join(' ')}
                >
                  {isWall && (
                    <span className="text-2xl select-none" style={{ fontSize: cellSize * 0.45 }}>
                      🪨
                    </span>
                  )}
                  {isGoal && (
                    <span
                      className="select-none animate-pulse"
                      style={{ fontSize: cellSize * 0.5 }}
                    >
                      🔋
                    </span>
                  )}
                  {item && !isWall && (
                    <span className="select-none" style={{ fontSize: cellSize * 0.4 }}>
                      ✨
                    </span>
                  )}
                  {isStart && (
                    <span
                      className="text-slate-600 font-mono select-none"
                      style={{ fontSize: Math.max(8, cellSize * 0.16) }}
                    >
                      INICIO
                    </span>
                  )}
                  {/* Grid coordinate (dev aid — hidden for now) */}
                </div>
              )
            })
          )}
        </div>

        {/* ── Codi ────────────────────────────────────────────── */}
        <div
          className="absolute flex items-center justify-center pointer-events-none"
          style={{
            width: cellSize,
            height: cellSize,
            left: player.x * (cellSize + CELL_GAP),
            top: player.y * (cellSize + CELL_GAP),
            transition: 'left 320ms cubic-bezier(0.4,0,0.2,1), top 320ms cubic-bezier(0.4,0,0.2,1)',
            zIndex: 10,
          }}
        >
          {/* Glow ring beneath Codi */}
          <div
            className="absolute rounded-full bg-[#534AB7]/30"
            style={{ width: cellSize * 0.7, height: cellSize * 0.7 }}
          />
          <span
            className="relative select-none z-10"
            style={{
              fontSize: cellSize * 0.55,
              lineHeight: 1,
              display: 'block',
              transform: `rotate(${DIR_ROTATION[player.direction]}deg)`,
              transition: 'transform 200ms ease-in-out',
            }}
          >
            🤖
          </span>
        </div>
      </div>
    </div>
  )
}

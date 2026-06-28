'use client'

import Link from 'next/link'
import type { LevelStatus } from '@/lib/data/levels'

export interface MissionSummary {
  id: string
  slug: string
  title: string
  objective: string
  world_order: number
}

export type MissionProgressMap = Record<
  string,
  'not_started' | 'started' | 'completed' | 'completed_extra'
>

interface Props {
  missions: MissionSummary[]
  progressMap: MissionProgressMap
  levelTitle: string
  levelEmoji: string
  levelStatus: LevelStatus
}

type EffectiveStatus = 'completed' | 'playable' | 'locked'

function getEffectiveStatus(
  idx: number,
  missions: MissionSummary[],
  progressMap: MissionProgressMap,
  levelStatus: LevelStatus
): EffectiveStatus {
  const slug = missions[idx].slug
  const dbStatus = progressMap[slug]

  if (dbStatus === 'completed' || dbStatus === 'completed_extra') return 'completed'

  if (levelStatus === 'locked') return 'locked'

  if (idx === 0) return 'playable'

  const prevSlug = missions[idx - 1].slug
  const prevStatus = progressMap[prevSlug]
  if (prevStatus === 'completed' || prevStatus === 'completed_extra') return 'playable'

  return 'locked'
}

export function MissionListPanel({
  missions,
  progressMap,
  levelTitle,
  levelEmoji,
  levelStatus,
}: Props) {
  return (
    <div className="flex flex-col h-full bg-white border-l border-[#E0E0F0]">
      {/* ── Panel header ─────────────────────────────────────── */}
      <div className="flex-shrink-0 px-5 py-4 border-b border-[#E0E0F0] bg-[#F8F9FF]">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl leading-none">{levelEmoji}</span>
          <div>
            <h2 className="text-[#1a1a2e] font-bold text-base leading-tight">{levelTitle}</h2>
            <p className="text-[#4a4a6a] text-[11px] mt-0.5">
              {missions.length > 0
                ? `${missions.length} misión${missions.length !== 1 ? 'es' : ''}`
                : 'Sin misiones aún'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Mission list ─────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5">
        {missions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16 gap-3">
            <span className="text-5xl">🔧</span>
            <p className="text-[#1a1a2e] font-semibold text-sm">¡Próximamente!</p>
            <p className="text-[#4a4a6a] text-xs leading-relaxed max-w-[200px]">
              Las misiones de este mundo están en construcción. ¡Vuelve pronto!
            </p>
          </div>
        ) : (
          missions
            .slice()
            .sort((a, b) => a.world_order - b.world_order)
            .map((mission, idx) => {
              const effectiveStatus = getEffectiveStatus(
                idx,
                missions,
                progressMap,
                levelStatus
              )
              return (
                <MissionItem
                  key={mission.id}
                  mission={mission}
                  index={idx}
                  status={effectiveStatus}
                />
              )
            })
        )}
      </div>
    </div>
  )
}

function MissionItem({
  mission,
  index,
  status,
}: {
  mission: MissionSummary
  index: number
  status: EffectiveStatus
}) {
  const num = String(index + 1).padStart(2, '0')

  if (status === 'completed') {
    return (
      <Link
        href={`/app/mision/${mission.id}`}
        className="group flex items-start gap-3 bg-[#E8F8F5] border border-[#00B894]/30 hover:border-[#00B894]/60 rounded-xl p-3.5 transition-all duration-200 block"
      >
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00B894]/20 flex items-center justify-center mt-0.5">
          <span className="text-[#00B894] text-sm font-bold leading-none">✓</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#007a5e] font-semibold text-sm leading-tight truncate">
            {mission.title}
          </p>
          <p className="text-[#007a5e]/60 text-xs mt-0.5 leading-snug line-clamp-2">
            {mission.objective}
          </p>
        </div>
        <span className="flex-shrink-0 text-[#00B894]/40 text-[10px] font-mono self-center group-hover:text-[#00B894]/70 transition-colors">
          {num}
        </span>
      </Link>
    )
  }

  if (status === 'playable') {
    return (
      <div className="flex items-start gap-3 bg-[#EEF0FF] border border-[#534AB7]/40 rounded-xl p-3.5 shadow-[0_2px_8px_rgba(83,74,183,0.1)]">
        <span className="flex-shrink-0 text-[#534AB7]/50 font-mono text-[11px] w-5 text-right mt-1">
          {num}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[#1a1a2e] font-semibold text-sm leading-tight">{mission.title}</p>
          <p className="text-[#4a4a6a] text-xs mt-0.5 leading-snug line-clamp-2">
            {mission.objective}
          </p>
        </div>
        <Link
          href={`/app/mision/${mission.id}`}
          className="flex-shrink-0 bg-[#00B894] hover:bg-[#009e7e] active:bg-[#008060] text-white font-bold text-xs px-3.5 py-2 rounded-lg transition-colors self-center"
        >
          ¡Jugar!
        </Link>
      </div>
    )
  }

  // locked
  return (
    <div className="flex items-start gap-3 bg-[#F5F5F8] border border-[#E0E0F0] rounded-xl p-3.5 opacity-55 select-none">
      <span className="flex-shrink-0 text-[#4a4a6a]/30 font-mono text-[11px] w-5 text-right mt-1">
        {num}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[#4a4a6a]/60 font-semibold text-sm leading-tight">{mission.title}</p>
        <p className="text-[#4a4a6a]/40 text-xs mt-0.5 leading-snug line-clamp-2">
          {mission.objective}
        </p>
      </div>
      <span className="flex-shrink-0 text-xl self-center">🔒</span>
    </div>
  )
}

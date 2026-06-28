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

  // Locked levels have no playable missions
  if (levelStatus === 'locked') return 'locked'

  // First mission: always playable if level is active
  if (idx === 0) return 'playable'

  // Subsequent missions: only if the previous one is completed
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
    <div className="flex flex-col h-full bg-[#0d0f1f] border-l border-[#534AB7]/20">
      {/* ── Panel header ─────────────────────────────────────── */}
      <div className="flex-shrink-0 px-5 py-4 border-b border-[#534AB7]/20">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl leading-none">{levelEmoji}</span>
          <div>
            <h2 className="text-white font-bold text-base leading-tight">{levelTitle}</h2>
            <p className="text-slate-500 text-[11px] mt-0.5">
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
            <p className="text-white font-semibold text-sm">¡Próximamente!</p>
            <p className="text-slate-500 text-xs leading-relaxed max-w-[200px]">
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
        className="group flex items-start gap-3 bg-[#0d2b1a] border border-[#00d4a1]/30 hover:border-[#00d4a1]/60 rounded-xl p-3.5 transition-all duration-200 block"
      >
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00d4a1]/20 flex items-center justify-center mt-0.5">
          <span className="text-[#00d4a1] text-sm font-bold leading-none">✓</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#00d4a1] font-semibold text-sm leading-tight truncate">
            {mission.title}
          </p>
          <p className="text-[#00d4a1]/55 text-xs mt-0.5 leading-snug line-clamp-2">
            {mission.objective}
          </p>
        </div>
        <span className="flex-shrink-0 text-[#00d4a1]/40 text-[10px] font-mono self-center group-hover:text-[#00d4a1]/70 transition-colors">
          {num}
        </span>
      </Link>
    )
  }

  if (status === 'playable') {
    return (
      <div className="flex items-start gap-3 bg-[#1a1a2e] border border-[#534AB7] rounded-xl p-3.5 shadow-[0_0_12px_rgba(83,74,183,0.2)]">
        <span className="flex-shrink-0 text-slate-500 font-mono text-[11px] w-5 text-right mt-1">
          {num}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm leading-tight">{mission.title}</p>
          <p className="text-slate-400 text-xs mt-0.5 leading-snug line-clamp-2">
            {mission.objective}
          </p>
        </div>
        <Link
          href={`/app/mision/${mission.id}`}
          className="flex-shrink-0 bg-[#00d4a1] hover:bg-[#00b88e] active:bg-[#009e76] text-[#0d0d1a] font-bold text-xs px-3.5 py-2 rounded-lg transition-colors self-center"
        >
          ¡Jugar!
        </Link>
      </div>
    )
  }

  // locked
  return (
    <div className="flex items-start gap-3 bg-[#111] border border-[#2a2a3a] rounded-xl p-3.5 opacity-50 select-none">
      <span className="flex-shrink-0 text-slate-700 font-mono text-[11px] w-5 text-right mt-1">
        {num}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-slate-600 font-semibold text-sm leading-tight">{mission.title}</p>
        <p className="text-slate-700 text-xs mt-0.5 leading-snug line-clamp-2">
          {mission.objective}
        </p>
      </div>
      <span className="flex-shrink-0 text-xl self-center">🔒</span>
    </div>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import type { LevelData, LevelStatus } from '@/lib/data/levels'

interface Props {
  level: LevelData
  status: LevelStatus
}

const STATUS_STYLES: Record<LevelStatus, string> = {
  completed:
    'bg-[#FFD700] border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.5)] cursor-pointer hover:shadow-[0_0_30px_rgba(255,215,0,0.8)] hover:scale-105',
  in_progress:
    'bg-[#534AB7] border-[#534AB7] cursor-pointer hover:scale-105',
  available:
    'bg-[#1a1a2e] border-[#00d4a1] shadow-[0_0_12px_rgba(0,212,161,0.3)] cursor-pointer hover:shadow-[0_0_24px_rgba(0,212,161,0.6)] hover:scale-105',
  locked:
    'bg-[#2a2a3a] border-[#3a3a4a] opacity-50 cursor-not-allowed',
}

const TITLE_COLOR: Record<LevelStatus, string> = {
  completed: 'text-[#1a1200] font-bold',
  in_progress: 'text-white font-bold',
  available: 'text-[#00d4a1] font-semibold',
  locked: 'text-slate-500',
}

export function WorldNode({ level, status }: Props) {
  const router = useRouter()

  function handleClick() {
    if (status === 'locked') return
    const href = level.firstMissionSlug
      ? `/app/mision/${level.firstMissionSlug}`
      : `/app/mision/${level.slug}`
    router.push(href)
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        onClick={handleClick}
        disabled={status === 'locked'}
        aria-label={`${level.title} — ${status === 'locked' ? 'bloqueado' : status === 'completed' ? 'completado' : status === 'in_progress' ? 'en progreso' : 'disponible'}`}
        className={[
          'w-[72px] h-[72px] rounded-full border-2 flex flex-col items-center justify-center transition-all duration-300 relative select-none',
          STATUS_STYLES[status],
          status === 'in_progress' ? 'animate-[pulse-glow_2s_ease-in-out_infinite]' : '',
        ].join(' ')}
      >
        {status === 'completed' ? (
          <>
            <span className="text-2xl leading-none">✓</span>
            <span className="text-[10px] font-bold text-[#1a1200] leading-none mt-0.5">
              {level.emoji}
            </span>
          </>
        ) : status === 'locked' ? (
          <span className="text-2xl leading-none">🔒</span>
        ) : (
          <span className="text-2xl leading-none">{level.emoji}</span>
        )}
      </button>

      <div className="text-center max-w-[88px]">
        <p className={`text-[10px] leading-tight ${TITLE_COLOR[status]}`}>{level.title}</p>
        {status === 'in_progress' && (
          <span className="inline-block mt-0.5 text-[9px] bg-[#534AB7]/30 text-[#a59cf0] rounded-full px-1.5 py-0.5 leading-none">
            activo
          </span>
        )}
      </div>
    </div>
  )
}

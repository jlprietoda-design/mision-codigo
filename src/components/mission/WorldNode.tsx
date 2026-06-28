'use client'

import type { LevelData, LevelStatus } from '@/lib/data/levels'

interface Props {
  level: LevelData
  status: LevelStatus
  onSelect?: (levelId: number) => void
  isSelected?: boolean
}

const STATUS_STYLES: Record<LevelStatus, string> = {
  completed:
    'bg-[#E8F8F5] border-[#00B894] cursor-pointer hover:shadow-[0_4px_16px_rgba(0,184,148,0.3)] hover:scale-105',
  in_progress:
    'bg-[#EEF0FF] border-[#534AB7] cursor-pointer hover:scale-105',
  available:
    'bg-white border-[#534AB7] shadow-[0_2px_12px_rgba(83,74,183,0.15)] cursor-pointer hover:shadow-[0_4px_20px_rgba(83,74,183,0.25)] hover:scale-105',
  locked:
    'bg-[#F0F0F5] border-[#D0D0E0] opacity-60 cursor-not-allowed',
}

const TITLE_COLOR: Record<LevelStatus, string> = {
  completed: 'text-[#007a5e] font-bold',
  in_progress: 'text-[#534AB7] font-bold',
  available: 'text-[#534AB7] font-semibold',
  locked: 'text-[#4a4a6a]/50',
}

export function WorldNode({ level, status, onSelect, isSelected }: Props) {
  function handleClick() {
    if (status === 'locked') return
    onSelect?.(level.id)
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        onClick={handleClick}
        disabled={status === 'locked'}
        aria-label={`${level.title} — ${
          status === 'locked'
            ? 'bloqueado'
            : status === 'completed'
              ? 'completado'
              : status === 'in_progress'
                ? 'en progreso'
                : 'disponible'
        }`}
        className={[
          'w-[72px] h-[72px] rounded-full border-2 flex flex-col items-center justify-center transition-all duration-300 relative select-none',
          STATUS_STYLES[status],
          status === 'in_progress' ? 'animate-[pulse-glow_2s_ease-in-out_infinite]' : '',
          isSelected ? 'ring-2 ring-[#534AB7] ring-offset-2 ring-offset-[#F8F9FF]' : '',
        ].join(' ')}
      >
        {status === 'completed' ? (
          <>
            <span className="text-2xl leading-none text-[#00B894]">✓</span>
            <span className="text-[10px] leading-none mt-0.5">{level.emoji}</span>
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
          <span className="inline-block mt-0.5 text-[9px] bg-[#EEF0FF] text-[#534AB7] border border-[#534AB7]/30 rounded-full px-1.5 py-0.5 leading-none">
            activo
          </span>
        )}
        {isSelected && status !== 'in_progress' && (
          <span className="inline-block mt-0.5 text-[9px] bg-[#EEF0FF] text-[#534AB7] rounded-full px-1.5 py-0.5 leading-none">
            seleccionado
          </span>
        )}
      </div>
    </div>
  )
}

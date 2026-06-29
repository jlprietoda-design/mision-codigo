'use client'

import { useTranslations } from 'next-intl'

export type CodiAnimation = 'idle' | 'talking' | 'celebrating' | 'thinking'

interface Props {
  message: string
  animation: CodiAnimation
  hintsUsed: number
  maxHints?: number
  onRequestHint: () => void
}

const ROBOT_FACE: Record<CodiAnimation, string> = {
  idle: '🤖',
  talking: '🗣️',
  celebrating: '🎉',
  thinking: '🤔',
}

export function CodiAssistant({ message, animation, hintsUsed, maxHints = 3, onRequestHint }: Props) {
  const t = useTranslations('mision')
  const hintsLeft = maxHints - hintsUsed
  const canHint = hintsLeft > 0

  return (
    <>
      <style>{`
        @keyframes codi-idle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        @keyframes codi-talking {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes codi-celebrating {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-16px) rotate(-8deg); }
          75% { transform: translateY(-12px) rotate(8deg); }
        }
        @keyframes codi-thinking {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes codi-bubble-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .codi-idle       { animation: codi-idle       3s ease-in-out infinite; }
        .codi-talking    { animation: codi-talking    0.6s ease-in-out infinite; }
        .codi-celebrating{ animation: codi-celebrating 0.4s ease-in-out infinite; }
        .codi-thinking   { animation: codi-thinking   0.8s ease-in-out infinite; }
        .codi-bubble     { animation: codi-bubble-in  0.3s ease-out both; }
      `}</style>

      <div className="bg-[#FFF8E7] border border-amber-200 rounded-2xl p-4 flex flex-col gap-3">
        {/* Avatar + bubble */}
        <div className="flex items-end gap-3">
          {/* Robot */}
          <div
            className={`text-4xl flex-shrink-0 codi-${animation}`}
            aria-label="Codi"
          >
            {ROBOT_FACE[animation]}
          </div>

          {/* Speech bubble */}
          <div className="relative flex-1 min-w-0">
            <div className="codi-bubble bg-white border border-amber-200 rounded-2xl rounded-bl-none px-3 py-2.5 text-sm text-[#1a1a2e] leading-snug shadow-sm">
              {message}
            </div>
            {/* Tail */}
            <div
              className="absolute -left-2 bottom-2 w-0 h-0"
              style={{
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
                borderRight: '8px solid #fde68a',
              }}
            />
          </div>
        </div>

        {/* Hint button */}
        <button
          onClick={onRequestHint}
          disabled={!canHint}
          className={[
            'w-full rounded-xl py-2 text-sm font-semibold transition-all duration-200',
            canHint
              ? 'bg-amber-400 hover:bg-amber-500 active:scale-[0.97] text-white shadow-sm'
              : 'bg-amber-100 text-amber-400 cursor-not-allowed',
          ].join(' ')}
        >
          {canHint
            ? `${t('codiHintButton')} (${hintsLeft}/${maxHints})`
            : t('codiNoMoreHints')}
        </button>
      </div>
    </>
  )
}

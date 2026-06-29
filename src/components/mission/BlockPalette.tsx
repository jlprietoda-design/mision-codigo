'use client'

import { useTranslations } from 'next-intl'
import type { Block } from '@/lib/mission-engine/types'

interface BlockMeta {
  labelKey: string
  icon: string
  bg: string
  border: string
  text: string
}

const BLOCK_CATALOG: Record<string, BlockMeta> = {
  move_forward: {
    labelKey: 'moveForward',
    icon: '⬆️',
    bg: 'bg-[#E8F8F5] hover:bg-[#d0f0e8] active:bg-[#c0e8dc]',
    border: 'border-[#00B894]/40',
    text: 'text-[#007a5e]',
  },
  turn_left: {
    labelKey: 'turnLeft',
    icon: '↩️',
    bg: 'bg-blue-50 hover:bg-blue-100 active:bg-blue-200',
    border: 'border-blue-200',
    text: 'text-blue-700',
  },
  turn_right: {
    labelKey: 'turnRight',
    icon: '↪️',
    bg: 'bg-blue-50 hover:bg-blue-100 active:bg-blue-200',
    border: 'border-blue-200',
    text: 'text-blue-700',
  },
  pick_item: {
    labelKey: 'pickItem',
    icon: '✋',
    bg: 'bg-amber-50 hover:bg-amber-100 active:bg-amber-200',
    border: 'border-amber-200',
    text: 'text-amber-700',
  },
  use_item: {
    labelKey: 'useItem',
    icon: '⚡',
    bg: 'bg-orange-50 hover:bg-orange-100 active:bg-orange-200',
    border: 'border-orange-200',
    text: 'text-orange-700',
  },
  repeat: {
    labelKey: 'repeat',
    icon: '🔄',
    bg: 'bg-[#EEF0FF] hover:bg-[#e0e3ff] active:bg-[#d0d5ff]',
    border: 'border-[#534AB7]/30',
    text: 'text-[#534AB7]',
  },
}

const MAX_PROGRAM = 20

interface Props {
  availableBlocks: string[]
  programBlocks: Block[]
  onAddBlock: (type: string) => void
  onRemoveBlock: (index: number) => void
  onExecute: () => void
  onReset: () => void
  onHint: () => void
  isAnimating: boolean
}

export function BlockPalette({
  availableBlocks,
  programBlocks,
  onAddBlock,
  onRemoveBlock,
  onExecute,
  onReset,
  onHint,
  isAnimating,
}: Props) {
  const t = useTranslations('mision')
  const canExecute = programBlocks.length > 0 && !isAnimating
  const programFull = programBlocks.length >= MAX_PROGRAM

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Available blocks ─────────────────────────────────── */}
      <div className="flex-shrink-0 p-3 border-b border-[#E0E0F0]">
        <p className="text-xs font-semibold text-[#4a4a6a]/60 uppercase tracking-wider mb-2 px-1">
          {t('availableBlocks')}
        </p>
        <div className="flex flex-col gap-1.5">
          {availableBlocks.map((type) => {
            const meta = BLOCK_CATALOG[type]
            if (!meta) return null
            return (
              <button
                key={type}
                onClick={() => !programFull && !isAnimating && onAddBlock(type)}
                disabled={programFull || isAnimating}
                className={[
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm font-semibold',
                  'transition-all duration-150 select-none',
                  meta.bg,
                  meta.border,
                  meta.text,
                  programFull || isAnimating ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
                ].join(' ')}
              >
                <span className="text-base">{meta.icon}</span>
                <span>{t(meta.labelKey as Parameters<typeof t>[0])}</span>
                <span className="ml-auto opacity-40 text-xs">{t('addBlock')}</span>
              </button>
            )
          })}
        </div>
        {programFull && (
          <p className="text-xs text-amber-600 mt-2 text-center">
            {t('maxBlocks', { max: MAX_PROGRAM })}
          </p>
        )}
      </div>

      {/* ── Program title (fixed outside scroll) ─────────────── */}
      <div className="flex-shrink-0 px-4 pt-2.5 pb-1.5 border-b border-[#E0E0F0] bg-[#F8F9FF]">
        <p className="text-xs font-semibold text-[#4a4a6a]/60 uppercase tracking-wider">
          {t('myProgram')}{' '}
          <span className="text-[#4a4a6a]/40 font-normal normal-case">
            ({programBlocks.length}/{MAX_PROGRAM})
          </span>
        </p>
      </div>
      {/* min-h-0 is required so overflow-y-scroll respects the flex container height */}
      <div
        className="flex-1 min-h-0 overflow-y-scroll scrollbar-purple p-3 border-b border-[#E0E0F0]"
        style={{ scrollbarGutter: 'stable' }}
      >
        {programBlocks.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-3xl mb-2">👆</p>
            <p className="text-[#4a4a6a]/50 text-xs leading-relaxed">
              {t('emptyProgram')}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {programBlocks.map((block, idx) => {
              const meta = BLOCK_CATALOG[block.type]
              if (!meta) return null
              return (
                <div
                  key={idx}
                  className={[
                    'flex items-center gap-2 px-2.5 py-2 rounded-lg border text-sm',
                    meta.bg.split(' ')[0],
                    meta.border,
                    meta.text,
                  ].join(' ')}
                >
                  <span className="text-[#4a4a6a]/40 font-mono text-[10px] w-5 text-right flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-base">{meta.icon}</span>
                  <span className="flex-1 text-sm font-medium">
                    {t(meta.labelKey as Parameters<typeof t>[0])}
                  </span>
                  <button
                    onClick={() => !isAnimating && onRemoveBlock(idx)}
                    disabled={isAnimating}
                    className="opacity-30 hover:opacity-70 transition-opacity text-xs px-1 py-0.5 rounded disabled:cursor-not-allowed"
                    aria-label={`Eliminar bloque ${idx + 1}`}
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Controls ─────────────────────────────────────────── */}
      <div className="flex-shrink-0 p-3 flex flex-col gap-2 bg-[#F8F9FF]">
        <button
          onClick={onExecute}
          disabled={!canExecute}
          className="w-full bg-[#00B894] hover:bg-[#009e7e] disabled:bg-[#00B894]/30 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2"
        >
          {isAnimating ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {t('executing')}
            </>
          ) : (
            <>{t('execute')}</>
          )}
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onReset}
            disabled={isAnimating}
            className="border border-[#E0E0F0] hover:border-[#534AB7]/40 hover:bg-[#EEF0FF] disabled:opacity-40 disabled:cursor-not-allowed text-[#4a4a6a] hover:text-[#534AB7] font-semibold py-2.5 rounded-xl transition text-xs"
          >
            {t('reset')}
          </button>
          <button
            onClick={onHint}
            disabled={isAnimating}
            className="border border-amber-200 hover:border-amber-400 hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed text-amber-600 hover:text-amber-700 font-semibold py-2.5 rounded-xl transition text-xs"
          >
            {t('hintBtn')}
          </button>
        </div>
      </div>
    </div>
  )
}

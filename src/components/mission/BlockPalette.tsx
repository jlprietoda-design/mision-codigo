'use client'

import type { Block } from '@/lib/mission-engine/types'

interface BlockMeta {
  label: string
  icon: string
  bg: string
  border: string
}

const BLOCK_CATALOG: Record<string, BlockMeta> = {
  move_forward: {
    label: 'Avanzar',
    icon: '⬆️',
    bg: 'bg-green-700 hover:bg-green-600 active:bg-green-800',
    border: 'border-green-500',
  },
  turn_left: {
    label: 'Girar ←',
    icon: '↩️',
    bg: 'bg-blue-700 hover:bg-blue-600 active:bg-blue-800',
    border: 'border-blue-500',
  },
  turn_right: {
    label: 'Girar →',
    icon: '↪️',
    bg: 'bg-blue-700 hover:bg-blue-600 active:bg-blue-800',
    border: 'border-blue-500',
  },
  pick_item: {
    label: 'Recoger',
    icon: '✋',
    bg: 'bg-yellow-700 hover:bg-yellow-600 active:bg-yellow-800',
    border: 'border-yellow-500',
  },
  use_item: {
    label: 'Usar objeto',
    icon: '⚡',
    bg: 'bg-orange-700 hover:bg-orange-600 active:bg-orange-800',
    border: 'border-orange-500',
  },
  repeat: {
    label: 'Repetir',
    icon: '🔄',
    bg: 'bg-purple-700 hover:bg-purple-600 active:bg-purple-800',
    border: 'border-purple-500',
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
  const canExecute = programBlocks.length > 0 && !isAnimating
  const programFull = programBlocks.length >= MAX_PROGRAM

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Available blocks ─────────────────────────────────── */}
      <div className="flex-shrink-0 p-3 border-b border-[#534AB7]/20">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">
          Bloques disponibles
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
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-white text-sm font-semibold',
                  'transition-all duration-150 select-none',
                  meta.bg,
                  meta.border,
                  programFull || isAnimating ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
                ].join(' ')}
              >
                <span className="text-base">{meta.icon}</span>
                <span>{meta.label}</span>
                <span className="ml-auto text-white/50 text-xs">+ añadir</span>
              </button>
            )
          })}
        </div>
        {programFull && (
          <p className="text-xs text-amber-400 mt-2 text-center">
            Máximo {MAX_PROGRAM} bloques. Elimina alguno.
          </p>
        )}
      </div>

      {/* ── Program ──────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-4 pt-2.5 pb-1.5 border-b border-[#534AB7]/10">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Mi programa{' '}
          <span className="text-slate-600 font-normal normal-case">
            ({programBlocks.length}/{MAX_PROGRAM})
          </span>
        </p>
      </div>
      {/* min-h-0 is required so overflow-y-scroll respects the flex container height */}
      <div
        className="flex-1 min-h-0 overflow-y-scroll scrollbar-purple p-3 border-b border-[#534AB7]/20"
        style={{ scrollbarGutter: 'stable' }}
      >
        {programBlocks.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-3xl mb-2">👆</p>
            <p className="text-slate-500 text-xs leading-relaxed">
              Haz clic en los bloques de arriba para añadirlos al programa.
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
                    'flex items-center gap-2 px-2.5 py-2 rounded-lg border text-white text-sm',
                    meta.bg.split(' ')[0], // only the base bg color, no hover
                    meta.border,
                  ].join(' ')}
                >
                  <span className="text-slate-400 font-mono text-[10px] w-5 text-right flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-base">{meta.icon}</span>
                  <span className="flex-1 text-sm">{meta.label}</span>
                  <button
                    onClick={() => !isAnimating && onRemoveBlock(idx)}
                    disabled={isAnimating}
                    className="text-white/40 hover:text-white/90 transition-colors text-xs px-1 py-0.5 rounded disabled:cursor-not-allowed"
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
      <div className="flex-shrink-0 p-3 flex flex-col gap-2">
        <button
          onClick={onExecute}
          disabled={!canExecute}
          className="w-full bg-[#00d4a1] hover:bg-[#00b88e] disabled:bg-[#00d4a1]/30 disabled:cursor-not-allowed text-[#0d0d1a] font-bold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2"
        >
          {isAnimating ? (
            <>
              <span className="w-4 h-4 border-2 border-[#0d0d1a]/30 border-t-[#0d0d1a] rounded-full animate-spin" />
              Ejecutando...
            </>
          ) : (
            <>▶ Ejecutar</>
          )}
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onReset}
            disabled={isAnimating}
            className="border border-[#534AB7]/50 hover:border-[#534AB7] disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 hover:text-white font-semibold py-2.5 rounded-xl transition text-xs"
          >
            ↺ Reiniciar
          </button>
          <button
            onClick={onHint}
            disabled={isAnimating}
            className="border border-yellow-600/50 hover:border-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed text-yellow-400 hover:text-yellow-300 font-semibold py-2.5 rounded-xl transition text-xs"
          >
            💡 Pista
          </button>
        </div>
      </div>
    </div>
  )
}

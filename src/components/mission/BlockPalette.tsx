'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { Block } from '@/lib/mission-engine/types'

interface BlockMeta {
  labelKey: string
  icon: string
  iconClass?: string
  preview?: string
  bg: string
  border: string
  text: string
}

const BLOCK_CATALOG: Record<string, BlockMeta> = {
  move_forward: {
    labelKey: 'moveForward',
    icon: '↑',
    iconClass: 'text-xl font-bold leading-none',
    bg: 'bg-[#E8F8F5] hover:bg-[#d0f0e8] active:bg-[#c0e8dc]',
    border: 'border-[#00B894]/40',
    text: 'text-[#007a5e]',
  },
  turn_left: {
    labelKey: 'turnLeft',
    icon: '↺',
    iconClass: 'text-xl font-bold leading-none',
    preview: '🤖←',
    bg: 'bg-blue-50 hover:bg-blue-100 active:bg-blue-200',
    border: 'border-blue-200',
    text: 'text-blue-700',
  },
  turn_right: {
    labelKey: 'turnRight',
    icon: '↻',
    iconClass: 'text-xl font-bold leading-none',
    preview: '🤖→',
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
  if_obstacle: {
    labelKey: 'ifObstacle',
    icon: '🚧',
    bg: 'bg-red-50 hover:bg-red-100 active:bg-red-200',
    border: 'border-red-200',
    text: 'text-red-700',
  },
  if_has_item: {
    labelKey: 'ifHasItem',
    icon: '🎒',
    bg: 'bg-orange-50 hover:bg-orange-100 active:bg-orange-200',
    border: 'border-orange-200',
    text: 'text-orange-700',
  },
  if_on_item: {
    labelKey: 'ifOnItem',
    icon: '📍',
    bg: 'bg-yellow-50 hover:bg-yellow-100 active:bg-yellow-200',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
  },
}

const CONTAINER_BLOCKS = new Set(['repeat', 'if_obstacle', 'if_has_item', 'if_on_item'])

const MAX_PROGRAM = 20

interface Props {
  availableBlocks: string[]
  programBlocks: Block[]
  onAddBlock: (type: string) => void
  onRemoveBlock: (index: number) => void
  onAddChildBlock: (parentIdx: number, type: string) => void
  onRemoveChildBlock: (parentIdx: number, childIdx: number) => void
  onUpdateRepeatTimes: (idx: number, times: number) => void
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
  onAddChildBlock,
  onRemoveChildBlock,
  onUpdateRepeatTimes,
  onExecute,
  onReset,
  onHint,
  isAnimating,
}: Props) {
  const t = useTranslations('mision')
  const [editingRepeatIdx, setEditingRepeatIdx] = useState<number | null>(null)

  const canExecute = programBlocks.length > 0 && !isAnimating
  const programFull = programBlocks.length >= MAX_PROGRAM

  function handlePaletteClick(type: string) {
    if (isAnimating) return
    if (editingRepeatIdx !== null) {
      if (CONTAINER_BLOCKS.has(type)) return // no nested containers
      onAddChildBlock(editingRepeatIdx, type)
    } else {
      if (!programFull) onAddBlock(type)
    }
  }

  function handleRemoveBlock(idx: number) {
    if (editingRepeatIdx === idx) setEditingRepeatIdx(null)
    else if (editingRepeatIdx !== null && editingRepeatIdx > idx) setEditingRepeatIdx(editingRepeatIdx - 1)
    onRemoveBlock(idx)
  }

  const isAddingToRepeat = editingRepeatIdx !== null

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Available blocks ─────────────────────────────────── */}
      <div className="flex-shrink-0 p-3 border-b border-[#E0E0F0]">
        {isAddingToRepeat ? (
          <div className="flex items-center justify-between bg-[#534AB7] text-white rounded-lg px-3 py-1.5 mb-2">
            <span className="text-xs font-semibold">
              {editingRepeatIdx !== null && programBlocks[editingRepeatIdx]?.type === 'repeat'
                ? t('addingInsideLoop', { num: editingRepeatIdx + 1 })
                : t('addingInsideConditional', { num: (editingRepeatIdx ?? 0) + 1 })}
            </span>
            <button
              onClick={() => setEditingRepeatIdx(null)}
              className="text-xs bg-white/20 hover:bg-white/30 rounded px-2 py-0.5 transition font-semibold"
            >
              {t('repeatEditing')}
            </button>
          </div>
        ) : (
          <p className="text-xs font-semibold text-[#4a4a6a]/60 uppercase tracking-wider mb-2 px-1">
            {t('availableBlocks')}
          </p>
        )}

        <div className="flex flex-col gap-1.5">
          {availableBlocks.map((type) => {
            const meta = BLOCK_CATALOG[type]
            if (!meta) return null
            const isRepeat = type === 'repeat'
            const disabledByMode = isAddingToRepeat && isRepeat
            const disabled = isAnimating || disabledByMode || (!isAddingToRepeat && programFull)
            return (
              <button
                key={type}
                onClick={() => !disabled && handlePaletteClick(type)}
                disabled={disabled}
                className={[
                  'w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-semibold',
                  'transition-all duration-150 select-none',
                  meta.bg,
                  meta.border,
                  meta.text,
                  disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
                ].join(' ')}
              >
                <span className={meta.iconClass ?? 'text-base'}>{meta.icon}</span>
                <span className="flex-1 text-left">{t(meta.labelKey as Parameters<typeof t>[0])}</span>
                {meta.preview && !isAddingToRepeat && (
                  <span className="text-sm font-normal opacity-80 bg-white/70 rounded px-1.5 py-0.5 border border-current/10 tabular-nums">
                    {meta.preview}
                  </span>
                )}
                <span className="opacity-40 text-xs">
                  {isAddingToRepeat && !isRepeat ? '→' : t('addBlock')}
                </span>
              </button>
            )
          })}
        </div>

        {!isAddingToRepeat && programFull && (
          <p className="text-xs text-amber-600 mt-2 text-center">
            {t('maxBlocks', { max: MAX_PROGRAM })}
          </p>
        )}
      </div>

      {/* ── Program title ────────────────────────────────────── */}
      <div className="flex-shrink-0 px-4 pt-2.5 pb-1.5 border-b border-[#E0E0F0] bg-[#F8F9FF]">
        <p className="text-xs font-semibold text-[#4a4a6a]/60 uppercase tracking-wider">
          {t('myProgram')}{' '}
          <span className="text-[#4a4a6a]/40 font-normal normal-case">
            ({programBlocks.length}/{MAX_PROGRAM})
          </span>
        </p>
      </div>

      {/* min-h-0 required so overflow-y-scroll respects flex container height */}
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
          <div className="flex flex-col gap-1.5">
            {programBlocks.map((block, idx) => {
              const meta = BLOCK_CATALOG[block.type]
              if (!meta) return null

              // ── Repeat block ──────────────────────────────────
              if (block.type === 'repeat') {
                const times = block.times ?? 2
                const children = block.children ?? []
                const isEditing = editingRepeatIdx === idx

                return (
                  <div
                    key={idx}
                    className={[
                      'rounded-lg border',
                      isEditing
                        ? 'border-[#534AB7] shadow-[0_0_0_2px_rgba(83,74,183,0.15)]'
                        : 'border-[#534AB7]/30',
                      'bg-[#EEF0FF]',
                    ].join(' ')}
                  >
                    {/* Repeat header */}
                    <div className="flex items-center gap-1 px-2.5 py-2 min-w-0">
                      <span className="text-[#4a4a6a]/40 font-mono text-[10px] w-4 text-right flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-sm flex-shrink-0">🔄</span>

                      {/* Times counter — flex-shrink-0 so it never collapses */}
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        <button
                          onClick={() => !isAnimating && onUpdateRepeatTimes(idx, Math.max(1, times - 1))}
                          disabled={isAnimating || times <= 1}
                          className="w-5 h-5 rounded border border-[#534AB7]/30 text-[#534AB7] text-xs flex items-center justify-center hover:bg-[#534AB7] hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed font-bold"
                        >
                          −
                        </button>
                        <span className="w-5 text-center text-sm font-bold text-[#534AB7] tabular-nums">
                          {times}
                        </span>
                        <button
                          onClick={() => !isAnimating && onUpdateRepeatTimes(idx, Math.min(10, times + 1))}
                          disabled={isAnimating || times >= 10}
                          className="w-5 h-5 rounded border border-[#534AB7]/30 text-[#534AB7] text-xs flex items-center justify-center hover:bg-[#534AB7] hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed font-bold"
                        >
                          +
                        </button>
                      </div>

                      {/* Label absorbs remaining space so ✕ never overflows */}
                      <span className="flex-1 min-w-0 text-[10px] text-[#534AB7]/60 truncate">
                        {t('repeatTimes')}
                      </span>

                      <button
                        type="button"
                        onClick={() => { if (!isAnimating) handleRemoveBlock(idx) }}
                        disabled={isAnimating}
                        className="flex-shrink-0 opacity-40 hover:opacity-80 active:opacity-100 transition-opacity text-xs px-1.5 py-0.5 rounded hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed"
                        aria-label={`Eliminar bucle ${idx + 1}`}
                      >
                        ✕
                      </button>
                    </div>

                    {/* Children */}
                    {children.length > 0 && (
                      <div className="px-2.5 pb-1.5 flex flex-col gap-1 border-t border-[#534AB7]/10 pt-1.5 ml-5 border-l-2 border-l-[#534AB7]/20">
                        {children.map((child, ci) => {
                          const cm = BLOCK_CATALOG[child.type]
                          if (!cm) return null
                          return (
                            <div
                              key={ci}
                              className={[
                                'flex items-center gap-1.5 px-2 py-1.5 rounded border text-xs',
                                cm.bg.split(' ')[0],
                                cm.border,
                                cm.text,
                              ].join(' ')}
                            >
                              <span className="text-[#4a4a6a]/40 font-mono text-[9px] w-6 text-right flex-shrink-0">
                                {idx + 1}.{ci + 1}
                              </span>
                              <span className={cm.iconClass ?? 'text-sm'}>{cm.icon}</span>
                              <span className="flex-1 font-medium">
                                {(child.type === 'move_forward' || child.type === 'turn_left' || child.type === 'turn_right') && (
                                  <span className="opacity-50 mr-0.5">{cm.icon}</span>
                                )}
                                {t(cm.labelKey as Parameters<typeof t>[0])}
                              </span>
                              <button
                                onClick={() => !isAnimating && onRemoveChildBlock(idx, ci)}
                                disabled={isAnimating}
                                className="opacity-30 hover:opacity-70 transition-opacity text-xs px-1 py-0.5 rounded disabled:cursor-not-allowed"
                                aria-label={`Eliminar instrucción ${idx + 1}.${ci + 1}`}
                              >
                                ✕
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Add inside button */}
                    {!isAnimating && (
                      <button
                        onClick={() => setEditingRepeatIdx(isEditing ? null : idx)}
                        className={[
                          'w-full text-[10px] font-semibold py-1.5 rounded-b-lg transition border-t',
                          isEditing
                            ? 'bg-[#534AB7] text-white border-[#534AB7]'
                            : 'text-[#534AB7]/70 border-[#534AB7]/10 hover:bg-[#534AB7]/10',
                        ].join(' ')}
                      >
                        {isEditing ? t('repeatEditing') : t('repeatAddInside')}
                      </button>
                    )}
                  </div>
                )
              }

              // ── Conditional block ─────────────────────────────
              if (CONTAINER_BLOCKS.has(block.type) && block.type !== 'repeat') {
                const children = block.children ?? []
                const isEditing = editingRepeatIdx === idx

                return (
                  <div
                    key={idx}
                    className={[
                      'rounded-lg border',
                      isEditing
                        ? `${meta.border} shadow-[0_0_0_2px_rgba(0,0,0,0.07)]`
                        : meta.border,
                      meta.bg.split(' ')[0],
                    ].join(' ')}
                  >
                    {/* Conditional header */}
                    <div className="flex items-center gap-1 px-2.5 py-2 min-w-0">
                      <span className="text-[#4a4a6a]/40 font-mono text-[10px] w-4 text-right flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-sm flex-shrink-0">{meta.icon}</span>
                      <span className={['flex-1 min-w-0 text-xs font-semibold truncate', meta.text].join(' ')}>
                        {t(meta.labelKey as Parameters<typeof t>[0])}
                      </span>
                      <button
                        type="button"
                        onClick={() => { if (!isAnimating) handleRemoveBlock(idx) }}
                        disabled={isAnimating}
                        className="flex-shrink-0 opacity-40 hover:opacity-80 active:opacity-100 transition-opacity text-xs px-1.5 py-0.5 rounded hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed"
                        aria-label={`Eliminar bloque ${idx + 1}`}
                      >
                        ✕
                      </button>
                    </div>

                    {/* Children */}
                    {children.length > 0 && (
                      <div className="px-2.5 pb-1.5 flex flex-col gap-1 border-t border-current/10 pt-1.5 ml-5 border-l-2 border-l-current/20">
                        {children.map((child, ci) => {
                          const cm = BLOCK_CATALOG[child.type]
                          if (!cm) return null
                          return (
                            <div
                              key={ci}
                              className={[
                                'flex items-center gap-1.5 px-2 py-1.5 rounded border text-xs',
                                cm.bg.split(' ')[0],
                                cm.border,
                                cm.text,
                              ].join(' ')}
                            >
                              <span className="text-[#4a4a6a]/40 font-mono text-[9px] w-6 text-right flex-shrink-0">
                                {idx + 1}.{ci + 1}
                              </span>
                              <span className={cm.iconClass ?? 'text-sm'}>{cm.icon}</span>
                              <span className="flex-1 font-medium">
                                {t(cm.labelKey as Parameters<typeof t>[0])}
                              </span>
                              <button
                                onClick={() => !isAnimating && onRemoveChildBlock(idx, ci)}
                                disabled={isAnimating}
                                className="opacity-30 hover:opacity-70 transition-opacity text-xs px-1 py-0.5 rounded disabled:cursor-not-allowed"
                                aria-label={`Eliminar instrucción ${idx + 1}.${ci + 1}`}
                              >
                                ✕
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Add inside button */}
                    {!isAnimating && (
                      <button
                        onClick={() => setEditingRepeatIdx(isEditing ? null : idx)}
                        className={[
                          'w-full text-[10px] font-semibold py-1.5 rounded-b-lg transition border-t',
                          isEditing
                            ? `bg-[#534AB7] text-white border-[#534AB7]`
                            : `${meta.text} border-current/10 hover:bg-current/5`,
                        ].join(' ')}
                      >
                        {isEditing ? t('repeatEditing') : t('repeatAddInside')}
                      </button>
                    )}
                  </div>
                )
              }

              // ── Regular block ─────────────────────────────────
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
                  <span className={meta.iconClass ?? 'text-base'}>{meta.icon}</span>
                  <span className="flex-1 text-sm font-medium">
                    {(block.type === 'move_forward' || block.type === 'turn_left' || block.type === 'turn_right') && (
                      <span className="opacity-50 mr-0.5">{meta.icon}</span>
                    )}
                    {t(meta.labelKey as Parameters<typeof t>[0])}
                  </span>
                  <button
                    onClick={() => !isAnimating && handleRemoveBlock(idx)}
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

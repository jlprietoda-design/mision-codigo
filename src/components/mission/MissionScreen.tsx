'use client'

import { useRef, useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/navigation'
import { executeMission } from '@/lib/mission-engine/executor'
import type { Block, ExecutionResult } from '@/lib/mission-engine/types'
import type { MissionData } from '@/lib/data/missions'
import { getNextMission } from '@/lib/data/missions'
import { useProfileStore } from '@/stores/profileStore'
import { saveMissionProgress, awardBadge } from '@/app/actions/progress'
import { MissionGrid } from './MissionGrid'
import { BlockPalette } from './BlockPalette'

const STEP_DELAY = 400

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

interface Props {
  mission: MissionData
  locale: string
}

function pick<T>(es: T, en: T, locale: string): T {
  return locale === 'en' ? en : es
}

export function MissionScreen({ mission, locale }: Props) {
  const t = useTranslations('mision')

  const title = pick(mission.title_es, mission.title_en, locale)
  const story = pick(mission.story_es, mission.story_en, locale)
  const objective = pick(mission.objective_es, mission.objective_en, locale)
  const concept = pick(mission.concept_es, mission.concept_en, locale)
  const hints = pick(mission.hints_es, mission.hints_en, locale)
  const [programBlocks, setProgramBlocks] = useState<Block[]>([])
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null)
  const [currentStepIdx, setCurrentStepIdx] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showFailure, setShowFailure] = useState(false)
  const [hintIdx, setHintIdx] = useState(-1)

  const cancelRef = useRef(false)
  const mountedRef = useRef(true)
  const attemptsRef = useRef(0)
  const hintsUsedRef = useRef(0)

  const router = useRouter()
  const activeProfile = useProfileStore((s) => s.activeProfile)
  const setSelectedLevelId = useProfileStore((s) => s.setSelectedLevelId)
  const nextMission = getNextMission(mission.id)

  function handleGoToMap() {
    setSelectedLevelId(mission.levelId)
    router.push('/app/mapa')
  }

  const currentStep = executionResult ? executionResult.steps[currentStepIdx] ?? null : null

  const collectedItemIds = useMemo<string[]>(() => {
    if (!executionResult) return []
    return executionResult.steps
      .slice(0, currentStepIdx + 1)
      .flatMap((s) => (s.collected ? [s.collected] : []))
  }, [executionResult, currentStepIdx])

  function addBlock(type: string) {
    setProgramBlocks((prev) => (prev.length < 20 ? [...prev, { type }] : prev))
  }

  function removeBlock(index: number) {
    setProgramBlocks((prev) => prev.filter((_, i) => i !== index))
  }

  function handleReset() {
    cancelRef.current = true
    setIsAnimating(false)
    setExecutionResult(null)
    setCurrentStepIdx(0)
    setShowSuccess(false)
    setShowFailure(false)
  }

  function handleHint() {
    if (hintIdx < hints.length - 1) {
      hintsUsedRef.current += 1
    }
    setHintIdx((prev) => Math.min(prev + 1, hints.length - 1))
    setShowFailure(false)
  }

  async function handleExecute() {
    if (isAnimating || programBlocks.length === 0) return
    attemptsRef.current += 1
    cancelRef.current = false
    setShowSuccess(false)
    setShowFailure(false)

    const result = executeMission(programBlocks, mission.mapConfig)
    setExecutionResult(result)
    setCurrentStepIdx(0)
    setIsAnimating(true)

    for (let i = 0; i < result.steps.length; i++) {
      if (cancelRef.current || !mountedRef.current) return
      setCurrentStepIdx(i)
      await sleep(STEP_DELAY)
    }

    if (cancelRef.current || !mountedRef.current) return
    setIsAnimating(false)

    if (result.success) {
      setShowSuccess(true)
      if (activeProfile?.id) {
        void saveMissionProgress(
          activeProfile.id,
          mission.id,
          'completed',
          attemptsRef.current,
          hintsUsedRef.current
        )
        if (mission.id === 'primeros-pasos-01') {
          void awardBadge(activeProfile.id, 'primera-instruccion')
        }
        if (mission.id === 'primeros-pasos-05') {
          void awardBadge(activeProfile.id, 'explorador-logico')
        }
      }
    } else {
      setShowFailure(true)
      if (activeProfile?.id) {
        void saveMissionProgress(
          activeProfile.id,
          mission.id,
          'started',
          attemptsRef.current,
          hintsUsedRef.current
        )
      }
    }
  }

  const activeHint = hintIdx >= 0 ? hints[hintIdx] : null

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#F8F9FF] overflow-hidden">

      {/* ── Top bar ─────────────────────────────────────────── */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 bg-white border-b border-[#E0E0F0] shadow-[0_1px_4px_rgba(83,74,183,0.06)]">
        <button
          onClick={handleGoToMap}
          className="flex items-center gap-1.5 text-[#4a4a6a] hover:text-[#534AB7] transition text-sm"
        >
          {t('backToMap')}
        </button>
        <div className="text-center">
          <h1 className="text-[#1a1a2e] font-bold text-sm leading-tight">{title}</h1>
          <p className="text-[#4a4a6a] text-[11px]">
            {t('levelMission', { level: mission.levelId, order: mission.order })}
          </p>
        </div>
        <div className="text-[#4a4a6a] text-xs text-right">
          {programBlocks.length > 0 && !isAnimating && (
            <span className="text-[#4a4a6a]/70">
              {t('blocksCount', { count: programBlocks.length })}
            </span>
          )}
        </div>
      </header>

      {/* ── Main 3-column layout ────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: story + info ───────────────────────────────── */}
        <aside className="w-[260px] flex-shrink-0 flex flex-col overflow-y-auto border-r border-[#E0E0F0] bg-white">
          <div className="p-4 space-y-4 flex-1">
            {/* Story */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🤖</span>
                <h2 className="text-[#1a1a2e] font-bold text-sm">{t('story')}</h2>
              </div>
              <p className="text-[#4a4a6a] text-xs leading-relaxed">{story}</p>
            </div>

            {/* Objective */}
            <div className="bg-[#EEF0FF] border border-[#534AB7]/20 rounded-xl p-3">
              <p className="text-xs font-semibold text-[#534AB7] uppercase tracking-wider mb-1">
                {t('objective')}
              </p>
              <p className="text-[#1a1a2e] text-xs leading-relaxed">{objective}</p>
            </div>

            {/* Concept */}
            <div className="bg-[#E8F8F5] border border-[#00B894]/20 rounded-xl p-3">
              <p className="text-xs font-semibold text-[#00B894] uppercase tracking-wider mb-1">
                {t('conceptLabel')}
              </p>
              <p className="text-[#1a1a2e] text-xs leading-relaxed">{concept}</p>
            </div>

            {/* Hint */}
            {activeHint && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs font-semibold text-amber-600 mb-1">
                  {t('hintLabel', { current: hintIdx + 1, total: hints.length })}
                </p>
                <p className="text-amber-800 text-xs leading-relaxed">{activeHint}</p>
              </div>
            )}
          </div>
        </aside>

        {/* Center: mission grid ─────────────────────────────── */}
        <main className="flex-1 min-w-0 bg-[#EEF0FF]">
          <MissionGrid
            mapConfig={mission.mapConfig}
            currentStep={currentStep}
            collectedItemIds={collectedItemIds}
          />
        </main>

        {/* Right: block palette ────────────────────────────── */}
        <aside className="w-[240px] flex-shrink-0 border-l border-[#E0E0F0] bg-white">
          <BlockPalette
            availableBlocks={mission.availableBlocks}
            programBlocks={programBlocks}
            onAddBlock={addBlock}
            onRemoveBlock={removeBlock}
            onExecute={handleExecute}
            onReset={handleReset}
            onHint={handleHint}
            isAnimating={isAnimating}
          />
        </aside>
      </div>

      {/* ── Success modal ───────────────────────────────────── */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
          <div className="bg-white border border-[#E0E0F0] rounded-2xl p-8 max-w-sm w-full text-center shadow-[0_8px_40px_rgba(83,74,183,0.2)]">
            <div className="text-6xl mb-1 animate-bounce">🎉</div>
            <div className="text-4xl mb-4">⭐⭐⭐</div>
            <h2 className="text-3xl font-bold text-[#1a1a2e] mb-2">{t('successTitle')}</h2>
            <p className="text-[#4a4a6a] text-sm mb-5">
              {t('successSubtitle', { order: mission.order, level: mission.levelId })}
            </p>

            <div className="bg-[#E8F8F5] border border-[#00B894]/30 rounded-xl p-4 mb-6 text-left">
              <p className="text-[#00B894] text-xs font-semibold mb-1">{t('learned')}</p>
              <p className="text-[#1a1a2e] text-sm leading-relaxed">{concept}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleGoToMap}
                className="flex-1 border border-[#E0E0F0] hover:border-[#534AB7]/40 hover:bg-[#EEF0FF] text-[#4a4a6a] hover:text-[#534AB7] font-semibold py-3 rounded-xl text-center transition text-sm"
              >
                {t('backToMapBtn')}
              </button>
              {nextMission ? (
                <Link
                  href={`/app/mision/${nextMission.id}` as `/app/mision/${string}`}
                  className="flex-1 bg-[#00B894] hover:bg-[#009e7e] text-white font-bold py-3 rounded-xl text-center transition text-sm"
                >
                  {t('next')}
                </Link>
              ) : (
                <button
                  onClick={handleGoToMap}
                  className="flex-1 bg-[#534AB7] hover:bg-[#4338ca] text-white font-bold py-3 rounded-xl text-center transition text-sm"
                >
                  {t('levelComplete')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Failure modal ───────────────────────────────────── */}
      {showFailure && executionResult && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
          <div className="bg-white border border-[#E0E0F0] rounded-2xl p-8 max-w-sm w-full text-center shadow-[0_8px_40px_rgba(83,74,183,0.2)]">
            <div className="text-5xl mb-3">😅</div>
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-2">{t('failureTitle')}</h2>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-600 text-sm leading-relaxed">{executionResult.message}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowFailure(false)
                  handleReset()
                }}
                className="flex-1 bg-[#534AB7] hover:bg-[#4338ca] text-white font-bold py-3 rounded-xl transition text-sm"
              >
                {t('retry')}
              </button>
              <button
                onClick={handleHint}
                className="flex-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 font-semibold py-3 rounded-xl transition text-sm"
              >
                {t('askHint')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

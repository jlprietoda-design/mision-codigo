'use client'

import { useRef, useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { executeMission } from '@/lib/mission-engine/executor'
import type { Block, ExecutionResult } from '@/lib/mission-engine/types'
import type { MissionData } from '@/lib/data/missions'
import { getNextMission } from '@/lib/data/missions'
import { useProfileStore } from '@/stores/profileStore'
import { saveMissionProgress, awardBadge } from '@/app/actions/progress'
import { MissionGrid } from './MissionGrid'
import { BlockPalette } from './BlockPalette'

const STEP_DELAY = 400 // ms per animation step

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

interface Props {
  mission: MissionData
}

export function MissionScreen({ mission }: Props) {
  const [programBlocks, setProgramBlocks] = useState<Block[]>([])
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null)
  const [currentStepIdx, setCurrentStepIdx] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showFailure, setShowFailure] = useState(false)
  const [hintIdx, setHintIdx] = useState(-1) // -1 = no hint shown yet

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

  // Current execution step (null = initial state, no execution yet)
  const currentStep = executionResult ? executionResult.steps[currentStepIdx] ?? null : null

  // Items collected up to and including the current step
  const collectedItemIds = useMemo<string[]>(() => {
    if (!executionResult) return []
    return executionResult.steps
      .slice(0, currentStepIdx + 1)
      .flatMap((s) => (s.collected ? [s.collected] : []))
  }, [executionResult, currentStepIdx])

  // ── Handlers ────────────────────────────────────────────────

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
    if (hintIdx < mission.hints.length - 1) {
      hintsUsedRef.current += 1
    }
    setHintIdx((prev) => Math.min(prev + 1, mission.hints.length - 1))
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

  // ── Render ──────────────────────────────────────────────────

  const activeHint = hintIdx >= 0 ? mission.hints[hintIdx] : null

  return (
    <div className="flex flex-col h-screen bg-[#0d0d1a] overflow-hidden">

      {/* ── Top bar ─────────────────────────────────────────── */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 bg-[#0d0d1a] border-b border-[#534AB7]/25">
        <button
          onClick={handleGoToMap}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition text-sm"
        >
          ← Mapa
        </button>
        <div className="text-center">
          <h1 className="text-white font-bold text-sm leading-tight">{mission.title}</h1>
          <p className="text-slate-600 text-[11px]">Nivel {mission.levelId} · Misión {mission.order}</p>
        </div>
        <div className="text-slate-600 text-xs text-right">
          {programBlocks.length > 0 && !isAnimating && (
            <span className="text-slate-500">{programBlocks.length} bloques</span>
          )}
        </div>
      </header>

      {/* ── Main 3-column layout ────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: story + info ───────────────────────────────── */}
        <aside className="w-[260px] flex-shrink-0 flex flex-col overflow-y-auto border-r border-[#534AB7]/20 bg-[#0d0f1f]">
          <div className="p-4 space-y-4 flex-1">
            {/* Story */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🤖</span>
                <h2 className="text-white font-bold text-sm">Historia</h2>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">{mission.story}</p>
            </div>

            {/* Objective */}
            <div className="bg-[#1a1a2e] border border-[#534AB7]/30 rounded-xl p-3">
              <p className="text-xs font-semibold text-[#534AB7] uppercase tracking-wider mb-1">
                Objetivo
              </p>
              <p className="text-slate-200 text-xs leading-relaxed">{mission.objective}</p>
            </div>

            {/* Concept */}
            <div className="bg-[#0a1a2a] border border-[#00d4a1]/20 rounded-xl p-3">
              <p className="text-xs font-semibold text-[#00d4a1] uppercase tracking-wider mb-1">
                💡 Concepto
              </p>
              <p className="text-slate-300 text-xs leading-relaxed">{mission.concept}</p>
            </div>

            {/* Hint (shown after clicking Pista) */}
            {activeHint && (
              <div className="bg-yellow-900/20 border border-yellow-600/40 rounded-xl p-3">
                <p className="text-xs font-semibold text-yellow-400 mb-1">
                  💡 Pista {hintIdx + 1}/{mission.hints.length}
                </p>
                <p className="text-yellow-200 text-xs leading-relaxed">{activeHint}</p>
              </div>
            )}
          </div>
        </aside>

        {/* Center: mission grid ─────────────────────────────── */}
        <main className="flex-1 min-w-0 bg-[#0c0c1e]">
          <MissionGrid
            mapConfig={mission.mapConfig}
            currentStep={currentStep}
            collectedItemIds={collectedItemIds}
          />
        </main>

        {/* Right: block palette ────────────────────────────── */}
        <aside className="w-[240px] flex-shrink-0 border-l border-[#534AB7]/20 bg-[#0d0f1f]">
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
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 px-4">
          <div className="bg-[#12122a] border border-[#00d4a1]/40 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="text-6xl mb-1 animate-bounce">🎉</div>
            <div className="text-4xl mb-4">⭐⭐⭐</div>
            <h2 className="text-3xl font-bold text-white mb-2">¡Misión superada!</h2>
            <p className="text-slate-400 text-sm mb-5">
              Completaste la misión {mission.order} del nivel {mission.levelId}.
            </p>

            {/* Concept learned */}
            <div className="bg-[#0a2518] border border-[#00d4a1]/30 rounded-xl p-4 mb-6 text-left">
              <p className="text-[#00d4a1] text-xs font-semibold mb-1">💡 Aprendiste</p>
              <p className="text-slate-300 text-sm leading-relaxed">{mission.concept}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleGoToMap}
                className="flex-1 border border-[#534AB7]/50 hover:border-[#534AB7] text-slate-300 hover:text-white font-semibold py-3 rounded-xl text-center transition text-sm"
              >
                🗺️ Volver al mapa
              </button>
              {nextMission ? (
                <Link
                  href={`/app/mision/${nextMission.id}`}
                  className="flex-1 bg-[#00d4a1] hover:bg-[#00b88e] text-[#0d0d1a] font-bold py-3 rounded-xl text-center transition text-sm"
                >
                  Siguiente ▶
                </Link>
              ) : (
                <button
                  onClick={handleGoToMap}
                  className="flex-1 bg-[#534AB7] hover:bg-[#4338ca] text-white font-bold py-3 rounded-xl text-center transition text-sm"
                >
                  🏆 ¡Nivel completado!
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Failure modal ───────────────────────────────────── */}
      {showFailure && executionResult && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 px-4">
          <div className="bg-[#12122a] border border-red-500/30 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="text-5xl mb-3">😅</div>
            <h2 className="text-2xl font-bold text-white mb-2">¡Casi lo tienes!</h2>

            <div className="bg-red-950/40 border border-red-500/20 rounded-xl p-4 mb-6">
              <p className="text-red-300 text-sm leading-relaxed">{executionResult.message}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowFailure(false)
                  handleReset()
                }}
                className="flex-1 bg-[#534AB7] hover:bg-[#4338ca] text-white font-bold py-3 rounded-xl transition text-sm"
              >
                ↺ Reintentar
              </button>
              <button
                onClick={handleHint}
                className="flex-1 bg-yellow-900/40 hover:bg-yellow-900/60 border border-yellow-600/50 text-yellow-300 font-semibold py-3 rounded-xl transition text-sm"
              >
                💡 Pedir pista
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import Link from 'next/link'
import type { ChildStats, MissionProgressRow } from '@/app/actions/progress'

interface BadgeRow {
  id: string
  earned_at: string
  badges: { name: string; icon: string; description: string } | null
}

interface Props {
  childAlias: string
  childAvatar: string
  stats: ChildStats | null
  badges: BadgeRow[]
  completedMissions: MissionProgressRow[]
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function ProgressDashboard({
  childAlias,
  childAvatar,
  stats,
  badges,
  completedMissions,
}: Props) {
  const hasProgress = completedMissions.length > 0 || badges.length > 0

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F8F9FF] text-[#1a1a2e]">
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="bg-white border-b border-[#E0E0F0] px-6 py-4 flex items-center gap-4">
        <Link
          href="/app/familia"
          className="text-[#4a4a6a] hover:text-[#534AB7] transition text-sm"
        >
          ← Familia
        </Link>
        <div className="flex items-center gap-3 ml-2">
          <div className="w-10 h-10 rounded-full bg-[#EEF0FF] flex items-center justify-center">
            <span className="text-2xl leading-none">{childAvatar}</span>
          </div>
          <div>
            <h1 className="text-[#1a1a2e] font-bold text-lg leading-tight">
              Progreso de{' '}
              <span className="text-[#534AB7]">{childAlias}</span>
            </h1>
            <p className="text-[#4a4a6a] text-xs">
              Nivel {stats?.currentLevel ?? 0} · {stats?.missionsCompleted ?? 0} misiones completadas
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">

        {/* ── Empty state ─────────────────────────────────────────── */}
        {!hasProgress && (
          <div className="text-center py-20">
            <div className="text-7xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-2">
              ¡La aventura está a punto de comenzar!
            </h2>
            <p className="text-[#4a4a6a] text-sm max-w-xs mx-auto leading-relaxed">
              {childAlias} todavía no ha completado ninguna misión. ¡Abre el mapa y empieza a explorar!
            </p>
            <Link
              href="/app/mapa"
              className="mt-6 inline-flex items-center gap-2 bg-[#00B894] hover:bg-[#009e7e] text-white font-bold px-8 py-3 rounded-xl transition text-sm"
            >
              ⚡ Ir al mapa de mundos
            </Link>
          </div>
        )}

        {hasProgress && (
          <>
            {/* ── Stats row ─────────────────────────────────────────── */}
            <section>
              <h2 className="text-xs font-semibold text-[#4a4a6a]/60 uppercase tracking-wider mb-4">
                Estadísticas
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard
                  icon="⚡"
                  label="Misiones completadas"
                  value={String(stats?.missionsCompleted ?? 0)}
                />
                <StatCard
                  icon="🏅"
                  label="Insignias ganadas"
                  value={String(stats?.badgesCount ?? 0)}
                />
                <StatCard
                  icon="🗺️"
                  label="Nivel actual"
                  value={String(stats?.currentLevel ?? 0)}
                />
                <StatCard
                  icon="📅"
                  label="Última actividad"
                  value={formatDate(stats?.lastActivity ?? null)}
                  small
                />
              </div>
            </section>

            {/* ── Badges ────────────────────────────────────────────── */}
            {badges.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold text-[#4a4a6a]/60 uppercase tracking-wider mb-4">
                  Insignias obtenidas
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {badges.map((row) => {
                    const badge = row.badges
                    if (!badge) return null
                    return (
                      <div
                        key={row.id}
                        className="bg-white border border-[#E0E0F0] rounded-2xl p-4 flex flex-col items-center gap-2 text-center shadow-[0_2px_8px_rgba(83,74,183,0.06)]"
                      >
                        <span className="text-4xl leading-none">{badge.icon}</span>
                        <p className="text-[#1a1a2e] text-sm font-semibold leading-tight">
                          {badge.name}
                        </p>
                        <p className="text-[#4a4a6a] text-[11px] leading-snug">
                          {badge.description}
                        </p>
                        <p className="text-[#4a4a6a]/40 text-[10px] mt-auto pt-1 border-t border-[#E0E0F0] w-full">
                          {formatDate(row.earned_at)}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* ── Completed missions ────────────────────────────────── */}
            {completedMissions.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold text-[#4a4a6a]/60 uppercase tracking-wider mb-4">
                  Misiones completadas
                </h2>
                <div className="flex flex-col gap-2">
                  {completedMissions.map((row) => (
                    <div
                      key={row.id}
                      className="bg-white border border-[#E0E0F0] rounded-xl p-4 flex items-start gap-4 shadow-[0_1px_4px_rgba(83,74,183,0.05)]"
                    >
                      <div className="text-2xl leading-none mt-0.5">✅</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#1a1a2e] font-semibold text-sm leading-tight">
                          {row.missions?.title ?? 'Misión completada'}
                        </p>
                        {row.missions?.concept && (
                          <p className="text-[#4a4a6a] text-xs mt-1 leading-snug">
                            💡 {row.missions.concept}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-[#00B894] text-xs font-semibold">
                          {row.attempts === 1 ? '⚡ 1 intento' : `${row.attempts} intentos`}
                        </p>
                        {row.hints_used > 0 && (
                          <p className="text-amber-500 text-[10px] mt-0.5">
                            {row.hints_used} pista{row.hints_used !== 1 ? 's' : ''}
                          </p>
                        )}
                        <p className="text-[#4a4a6a]/40 text-[10px] mt-1">
                          {formatDate(row.completed_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  small = false,
}: {
  icon: string
  label: string
  value: string
  small?: boolean
}) {
  return (
    <div className="bg-white border border-[#E0E0F0] rounded-xl p-4 flex flex-col items-center gap-1 text-center shadow-[0_2px_8px_rgba(83,74,183,0.06)]">
      <span className="text-2xl leading-none">{icon}</span>
      <p
        className={[
          'font-bold text-[#1a1a2e] leading-tight',
          small ? 'text-sm' : 'text-2xl',
        ].join(' ')}
      >
        {value}
      </p>
      <p className="text-[#4a4a6a]/60 text-[11px] leading-snug">{label}</p>
    </div>
  )
}

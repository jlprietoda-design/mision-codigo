import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LEVELS } from '@/lib/data/levels'
import { StarryBackground } from '@/components/ui/StarryBackground'
import { SetActiveProfile } from '@/components/mission/SetActiveProfile'

interface Props {
  params: Promise<{ childId: string }>
}

export default async function PerfilPage({ params }: Props) {
  const { childId } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('child_profiles')
    .select('id, alias, avatar, age_range, current_level_id')
    .eq('id', childId)
    .eq('user_id', user.id)
    .single()

  if (!profile) redirect('/app/familia')

  const currentLevel =
    LEVELS.find((l) => l.id === profile.current_level_id) ?? LEVELS[0]

  const secondaryLinks = [
    { href: '/app/mapa', icon: '🗺️', label: 'Mapa de mundos', active: true },
    { href: `/app/progreso/${profile.id}`, icon: '🏅', label: 'Mi progreso', active: true },
    { href: '#', icon: '🎮', label: 'Mis proyectos', active: false },
  ]

  return (
    <>
      <StarryBackground />

      {/* Invisible client bridge: writes profile data into the Zustand store */}
      <SetActiveProfile
        id={profile.id}
        alias={profile.alias}
        avatar={profile.avatar}
        currentLevelId={profile.current_level_id}
      />

      <div className="relative z-10 min-h-screen bg-[#0d0d1a]/80 flex flex-col items-center justify-center px-4 py-12 text-center">
        {/* Animated avatar */}
        <div style={{ animation: 'float 3s ease-in-out infinite' }}>
          <div className="text-[96px] leading-none select-none">{profile.avatar}</div>
        </div>

        {/* Greeting */}
        <h1 className="mt-6 text-4xl sm:text-5xl font-bold text-white">
          ¡Hola, <span className="text-[#00d4a1]">{profile.alias}</span>!
        </h1>

        {/* Current world badge */}
        <div className="mt-3 inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#534AB7]/50 rounded-full px-5 py-2">
          <span className="text-xl">{currentLevel.emoji}</span>
          <span className="text-slate-300 text-sm font-medium">
            Mundo {currentLevel.id} — {currentLevel.title}
          </span>
        </div>

        {/* Primary CTA */}
        <Link
          href="/app/mapa"
          className="mt-8 inline-flex items-center gap-3 bg-[#00d4a1] hover:bg-[#00b88e] text-[#0d0d1a] font-bold text-lg px-10 py-4 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,212,161,0.4)]"
        >
          <span>⚡</span>
          ¡Continuar misión!
        </Link>

        {/* Secondary links grid */}
        <div className="mt-10 grid grid-cols-3 gap-3 w-full max-w-sm">
          {secondaryLinks.map(({ href, icon, label, active }) =>
            active ? (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-center gap-2 bg-[#1a1a2e] hover:bg-[#252540] border border-[#534AB7]/40 hover:border-[#534AB7] rounded-xl p-4 transition-all duration-200 group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{icon}</span>
                <span className="text-slate-300 text-xs leading-tight text-center">{label}</span>
              </Link>
            ) : (
              <div
                key={label}
                className="flex flex-col items-center gap-2 bg-[#1a1a2e]/60 border border-[#534AB7]/20 rounded-xl p-4 opacity-50 select-none"
              >
                <span className="text-3xl">{icon}</span>
                <span className="text-slate-500 text-xs leading-tight text-center">{label}</span>
                <span className="text-[9px] text-slate-600 leading-none">próximamente</span>
              </div>
            )
          )}
        </div>

        {/* Back link */}
        <Link
          href="/app/familia"
          className="mt-8 text-slate-500 hover:text-slate-300 text-sm transition-colors"
        >
          ← Cambiar aventurero
        </Link>
      </div>
    </>
  )
}

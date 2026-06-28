import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LEVELS } from '@/lib/data/levels'
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
      {/* Invisible client bridge: writes profile data into the Zustand store */}
      <SetActiveProfile
        id={profile.id}
        alias={profile.alias}
        avatar={profile.avatar}
        currentLevelId={profile.current_level_id}
      />

      <div className="min-h-[calc(100vh-4rem)] bg-[#F8F9FF] flex flex-col items-center justify-center px-4 py-12 text-center">
        {/* Avatar */}
        <div
          className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-[#EEF0FF] shadow-[0_4px_20px_rgba(83,74,183,0.15)]"
          style={{ animation: 'float 3s ease-in-out infinite' }}
        >
          <span className="text-6xl leading-none select-none">{profile.avatar}</span>
        </div>

        {/* Greeting */}
        <h1 className="mt-6 text-4xl sm:text-5xl font-bold text-[#1a1a2e]">
          ¡Hola, <span className="text-[#534AB7]">{profile.alias}</span>!
        </h1>

        {/* Current world badge */}
        <div className="mt-3 inline-flex items-center gap-2 bg-white border border-[#E0E0F0] rounded-full px-5 py-2 shadow-[0_2px_8px_rgba(83,74,183,0.08)]">
          <span className="text-xl">{currentLevel.emoji}</span>
          <span className="text-[#4a4a6a] text-sm font-medium">
            Mundo {currentLevel.id} — {currentLevel.title}
          </span>
        </div>

        {/* Primary CTA */}
        <Link
          href="/app/mapa"
          className="mt-8 inline-flex items-center gap-3 bg-[#00B894] hover:bg-[#009e7e] text-white font-bold text-lg px-10 py-4 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(0,184,148,0.3)]"
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
                className="flex flex-col items-center gap-2 bg-white hover:bg-[#EEF0FF] border border-[#E0E0F0] hover:border-[#534AB7]/40 rounded-xl p-4 transition-all duration-200 group shadow-[0_2px_8px_rgba(83,74,183,0.06)]"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{icon}</span>
                <span className="text-[#4a4a6a] text-xs leading-tight text-center">{label}</span>
              </Link>
            ) : (
              <div
                key={label}
                className="flex flex-col items-center gap-2 bg-[#F8F9FF] border border-[#E0E0F0] rounded-xl p-4 opacity-50 select-none"
              >
                <span className="text-3xl">{icon}</span>
                <span className="text-[#4a4a6a] text-xs leading-tight text-center">{label}</span>
                <span className="text-[9px] text-[#4a4a6a]/50 leading-none">próximamente</span>
              </div>
            )
          )}
        </div>

        {/* Back link */}
        <Link
          href="/app/familia"
          className="mt-8 text-[#4a4a6a] hover:text-[#534AB7] text-sm transition-colors"
        >
          ← Cambiar aventurero
        </Link>
      </div>
    </>
  )
}

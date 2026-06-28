import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ChildProfileCard } from '@/components/family/ChildProfileCard'

export default async function FamiliaPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profileRow }, { data: childProfiles }] = await Promise.all([
    supabase.from('profiles').select('name').eq('id', user.id).single(),
    supabase
      .from('child_profiles')
      .select('id, alias, avatar, age_range, current_level_id')
      .order('created_at', { ascending: true }),
  ])

  const profiles = childProfiles ?? []
  const adultName = profileRow?.name ?? 'aventurero'

  // Fetch level titles for any non-zero levels present
  const levelIds = [...new Set(profiles.map((p) => p.current_level_id).filter((id) => id > 0))]
  let levelMap: Record<number, string> = {}
  if (levelIds.length > 0) {
    const { data: levels } = await supabase
      .from('levels')
      .select('id, title')
      .in('id', levelIds)
    if (levels) {
      for (const l of levels) levelMap[l.id] = l.title
    }
  }

  // Fetch completed mission counts grouped by child profile
  let missionCounts: Record<string, number> = {}
  if (profiles.length > 0) {
    const { data: progress } = await supabase
      .from('mission_progress')
      .select('child_profile_id')
      .in('status', ['completed', 'completed_extra'])
      .in(
        'child_profile_id',
        profiles.map((p) => p.id)
      )
    if (progress) {
      for (const row of progress) {
        missionCounts[row.child_profile_id] = (missionCounts[row.child_profile_id] ?? 0) + 1
      }
    }
  }

  if (profiles.length === 0) {
    return (
      <div className="min-h-screen bg-[#0d0d1a] flex flex-col items-center justify-center px-4 text-center">
        <div className="text-8xl mb-6">🤖</div>
        <h1 className="text-4xl font-bold text-white mb-3">¡Hola, {adultName}!</h1>
        <p className="text-slate-400 text-lg mb-8 max-w-md">
          Aún no tienes aventureros. Crea el primer perfil para que tu hijo empiece su misión.
        </p>
        <Link
          href="/app/familia/nuevo-perfil"
          className="bg-[#00d4a1] hover:bg-[#00b88e] text-[#0d0d1a] font-bold px-8 py-4 rounded-xl text-lg transition"
        >
          Crear primer perfil
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d0d1a] px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white">Mis aventureros</h1>
            <p className="text-slate-400 mt-1">Panel de {adultName}</p>
          </div>
          <Link
            href="/app/familia/nuevo-perfil"
            className="bg-[#534AB7] hover:bg-[#4338ca] text-white font-semibold px-5 py-2.5 rounded-xl transition text-sm whitespace-nowrap"
          >
            + Añadir perfil
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => {
            const lvl = profile.current_level_id
            const levelLabel =
              lvl === 0
                ? 'Nivel 0 — Primeros Pasos'
                : levelMap[lvl]
                  ? `Nivel ${lvl} — ${levelMap[lvl]}`
                  : `Nivel ${lvl}`

            return (
              <ChildProfileCard
                key={profile.id}
                id={profile.id}
                alias={profile.alias}
                avatar={profile.avatar}
                age_range={profile.age_range}
                levelLabel={levelLabel}
                completedMissions={missionCounts[profile.id] ?? 0}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

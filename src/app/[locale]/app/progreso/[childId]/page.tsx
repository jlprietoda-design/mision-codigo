import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getChildStats, getMissionProgress } from '@/app/actions/progress'
import { ProgressDashboard } from '@/components/family/ProgressDashboard'

interface Props {
  params: Promise<{ childId: string }>
}

export default async function ProgresoPage({ params }: Props) {
  const { childId } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: child } = await supabase
    .from('child_profiles')
    .select('id, alias, avatar, current_level_id')
    .eq('id', childId)
    .eq('user_id', user!.id)
    .single()

  if (!child) redirect('/app/familia')

  const [stats, completedMissions, { data: rawBadges }] = await Promise.all([
    getChildStats(childId),
    getMissionProgress(childId),
    supabase
      .from('child_badges')
      .select('id, earned_at, badges ( name, icon, description )')
      .eq('child_profile_id', childId)
      .order('earned_at', { ascending: false }),
  ])

  const badges = (rawBadges as unknown as {
    id: string
    earned_at: string
    badges: { name: string; icon: string; description: string } | null
  }[]) ?? []

  return (
    <ProgressDashboard
      childAlias={child!.alias}
      childAvatar={child!.avatar}
      stats={stats}
      badges={badges}
      completedMissions={completedMissions}
    />
  )
}

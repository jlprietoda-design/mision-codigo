import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getMissionById } from '@/lib/data/missions'
import { MissionScreen } from '@/components/mission/MissionScreen'

interface Props {
  params: Promise<{ missionId: string }>
}

export default async function MisionPage({ params }: Props) {
  const { missionId } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const mission = getMissionById(missionId)
  if (!mission) redirect('/app/mapa')

  return <MissionScreen mission={mission} />
}

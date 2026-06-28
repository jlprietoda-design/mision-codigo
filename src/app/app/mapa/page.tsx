import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MapaClient } from '@/components/mission/MapaClient'

export default async function MapaPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return <MapaClient />
}

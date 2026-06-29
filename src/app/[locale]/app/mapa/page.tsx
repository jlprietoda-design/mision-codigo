import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MapaClient } from '@/components/mission/MapaClient'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function MapaPage({ params }: Props) {
  const { locale } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return <MapaClient locale={locale} />
}

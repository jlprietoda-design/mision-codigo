import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NuevoPerfilForm } from '@/components/family/NuevoPerfilForm'

export default async function NuevoPerfilPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/app/familia/nuevo-perfil')

  return (
    <div className="min-h-screen bg-[#0d0d1a] flex items-center justify-center px-4 py-10">
      <NuevoPerfilForm />
    </div>
  )
}

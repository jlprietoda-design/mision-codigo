import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NuevoPerfilForm } from '@/components/family/NuevoPerfilForm'

export default async function NuevoPerfilPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F8F9FF] flex items-center justify-center px-4 py-10">
      <NuevoPerfilForm />
    </div>
  )
}

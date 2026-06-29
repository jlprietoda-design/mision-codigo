import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RegistroForm } from './RegistroForm'

export default async function RegistroPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) redirect('/app/familia')

  return <RegistroForm />
}

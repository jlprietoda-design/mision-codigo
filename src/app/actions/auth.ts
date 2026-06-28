'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

function mapError(message: string): string {
  if (message.includes('Invalid login credentials')) {
    return 'Email o contraseña incorrectos. Comprueba tus datos e inténtalo de nuevo.'
  }
  if (message.includes('Email not confirmed')) {
    return 'Confirma tu email antes de iniciar sesión. Revisa tu bandeja de entrada.'
  }
  if (message.includes('User already registered') || message.includes('already been registered')) {
    return 'Ya existe una cuenta con este email. Intenta iniciar sesión.'
  }
  if (message.includes('rate limit') || message.includes('over_email_send_rate_limit')) {
    return 'Demasiados intentos seguidos. Espera unos minutos e inténtalo de nuevo.'
  }
  if (message.includes('Password should be')) {
    return 'La contraseña debe tener al menos 8 caracteres.'
  }
  if (message.includes('Unable to validate email')) {
    return 'El formato del email no es válido.'
  }
  return 'Algo salió mal. Inténtalo de nuevo en unos momentos.'
}

export async function signIn(
  formData: FormData
): Promise<{ error?: string }> {
  const email = (formData.get('email') as string).trim()
  const password = formData.get('password') as string

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: mapError(error.message) }
  }

  revalidatePath('/', 'layout')
  redirect('/app/familia')
}

export async function signUp(
  formData: FormData
): Promise<{ error?: string; needsConfirmation?: boolean }> {
  const name = (formData.get('name') as string).trim()
  const email = (formData.get('email') as string).trim()
  const password = formData.get('password') as string
  const role = (formData.get('role') as string) || 'family'

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  })

  if (error) {
    return { error: mapError(error.message) }
  }

  // Email confirmation is enabled — ask user to check inbox
  if (!data.session) {
    return { needsConfirmation: true }
  }

  // Update profile role if teacher (trigger defaults to 'family')
  if (role === 'teacher' && data.user) {
    await supabase
      .from('profiles')
      .update({ role: 'teacher' })
      .eq('id', data.user.id)
  }

  revalidatePath('/', 'layout')
  redirect('/app/familia')
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

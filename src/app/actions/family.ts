'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const VALID_AGE_RANGES = ['6-8', '8-10', '10-12', '12-14'] as const
type AgeRange = (typeof VALID_AGE_RANGES)[number]

const ALIAS_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9\-]{2,20}$/

export async function createChildProfile(
  formData: FormData
): Promise<{ error?: string }> {
  const alias = ((formData.get('alias') as string) ?? '').trim()
  const age_range = formData.get('age_range') as string
  const avatar = (formData.get('avatar') as string) || '🤖'

  if (!ALIAS_REGEX.test(alias)) {
    return {
      error:
        'El alias solo puede tener letras, números y guiones, y debe tener entre 2 y 20 caracteres.',
    }
  }

  if (!VALID_AGE_RANGES.includes(age_range as AgeRange)) {
    return { error: 'Selecciona un rango de edad.' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { error } = await supabase
    .from('child_profiles')
    .insert({ user_id: user.id, alias, age_range, avatar })

  if (error) {
    return { error: 'No se pudo crear el perfil. Inténtalo de nuevo.' }
  }

  revalidatePath('/app/familia')
  redirect('/app/familia')
}

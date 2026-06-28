'use client'

import { useEffect, useState } from 'react'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface UserProfile {
  id: string
  name: string | null
  role: 'family' | 'teacher' | 'admin'
  created_at: string
  updated_at: string
}

interface UseUserReturn {
  user: SupabaseUser | null
  profile: UserProfile | null
  loading: boolean
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    let isMounted = true

    async function fetchProfile(userId: string) {
      const { data } = await supabase
        .from('profiles')
        .select('id, name, role, created_at, updated_at')
        .eq('id', userId)
        .single()

      if (isMounted) setProfile(data ?? null)
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return

      const currentUser = session?.user ?? null
      setUser(currentUser)

      if (currentUser) {
        await fetchProfile(currentUser.id)
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  return { user, profile, loading }
}

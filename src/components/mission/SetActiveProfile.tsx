'use client'

import { useEffect } from 'react'
import { useProfileStore } from '@/stores/profileStore'

interface Props {
  id: string
  alias: string
  avatar: string
  currentLevelId: number
}

export function SetActiveProfile({ id, alias, avatar, currentLevelId }: Props) {
  const setActiveProfile = useProfileStore((s) => s.setActiveProfile)

  useEffect(() => {
    setActiveProfile({ id, alias, avatar, currentLevelId })
  }, [id, alias, avatar, currentLevelId, setActiveProfile])

  return null
}

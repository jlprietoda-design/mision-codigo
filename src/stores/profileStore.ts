import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ActiveProfile {
  id: string
  alias: string
  avatar: string
  currentLevelId: number
}

interface ProfileState {
  activeProfile: ActiveProfile | null
  setActiveProfile: (profile: ActiveProfile) => void
  clearActiveProfile: () => void
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      activeProfile: null,
      setActiveProfile: (profile) => set({ activeProfile: profile }),
      clearActiveProfile: () => set({ activeProfile: null }),
    }),
    { name: 'mision-codigo-active-profile' }
  )
)

import { create } from 'zustand'

import { localStorage } from '@/lib/storage/mmkv'

interface Session {
  token: string
}

interface Store {
  session: Session | null
  authenticate: (session: Session) => void
  logout: () => void
}

export const useAuthStore = create<Store>((set) => {
  return {
    session: null,
    authenticate(session) {
      set({ session })
    },
    logout() {
      localStorage.delete('token')
      set({ session: null })
    },
  }
})

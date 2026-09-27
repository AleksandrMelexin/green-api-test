import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Creds } from '@/shared/api/green-api'

type AuthState = { creds: Creds | null; login: (c: Creds) => void; logout: () => void }

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      creds: null,
      login: (creds) => set({ creds }),
      logout: () => set({ creds: null }),
    }),
    { name: 'auth', storage: createJSONStorage(() => sessionStorage) },
  ),
)
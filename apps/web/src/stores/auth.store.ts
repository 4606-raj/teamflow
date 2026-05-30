// stores/auth.store.ts

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { authService } from '@/services/auth.service'
import type { AuthState, User } from '@/types/auth.types'

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user: User | null) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),

      fetchCurrentUser: async () => {
        try {
          set({ isLoading: true })

          const response = await authService.me()

          set({
            user: response.data,
            isAuthenticated: true,
          })
        } catch {
          set({
            user: null,
            isAuthenticated: false,
          })
        } finally {
          set({
            isLoading: false,
          })
        }
      },
    }),
    {
      name: 'teamflow-auth',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
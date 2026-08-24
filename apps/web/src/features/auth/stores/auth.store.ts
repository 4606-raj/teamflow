import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

import { authApi } from '@/features/auth'
import type { AuthState, User } from '@/features/auth'

export const useAuthStore = create<AuthState>()(
  devtools(

    persist(
      (set) => ({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,

        login: (
          user: User, 
          tokens: { accessToken: string | null; refreshToken: string | null }
        ) => {
          set({
            user: user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            isAuthenticated: true
          }),
           false,
          'auth/login'
        },
        setAccessToken: (accessToken: string | null) => {
          set({
            accessToken: accessToken,
            isAuthenticated: true

          })
        },
        setRefreshToken: (refreshToken: string | null) => {
          set({
            refreshToken: refreshToken
          })
        },
        
        setUser: (user: User | null) =>
          set({
            user,
            isAuthenticated: !!user,
          }),

        logout: () =>
          set({
            user: null,
            isAuthenticated: false,
            accessToken: null,
            refreshToken: null,
          }),

        fetchCurrentUser: async () => {
          try {
            const response = await authApi.me();
            set({
                user: response.data,
                isAuthenticated: true,
            });
            return response.data
          } catch {
            set({
              user: null,
              isAuthenticated: false,
            });
          }
        },
      }),
      {
        name: 'teamflow-auth',
      }
    )
  )
)
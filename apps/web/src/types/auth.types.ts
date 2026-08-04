
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null

  isAuthenticated: boolean
  isLoading: boolean

  login: (user: User, tokens: { accessToken: string | null; refreshToken: string | null }) => void
  logout: () => void
  setUser: (user: User | null) => void
  setAccessToken: (accessToken: string | null) => void
  setRefreshToken: (refreshToken: string | null) => void
  fetchCurrentUser: () => Promise<void>
}
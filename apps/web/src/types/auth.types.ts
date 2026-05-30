
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  setUser: (user: User | null) => void
  logout: () => void
  fetchCurrentUser: () => Promise<void>
}

export interface Organization {
  id: string
  name: string
  slug: string
  role: string
}

export interface Invitation {
  id: string
  token: string | null
  email: string
  role: string
  status: string
  organization: {
    id: string
    name: string
  }
}

export interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  systemRole: string
  organizations: Organization[]
  invitations: Invitation[]
}

export interface AuthState {
  user: User | null
  accessToken: string | null

  isAuthenticated: boolean
  isLoading: boolean

  login: (user: User, accessToken: string | null) => void
  logout: () => void
  setUser: (user: User | null) => void
  setAccessToken: (accessToken: string | null) => void
  fetchCurrentUser: () => Promise<User | undefined>
}
import { api } from '@/shared/api/api'
import type { LoginRequest, RegisterRequest, User } from '@teamflow/types'
import type { AxiosResponse } from 'axios'

export const authApi = {
  login(data: LoginRequest): Promise<AxiosResponse> {
    return api.post('/auth/login', data, {
      skipAuthRefresh: true,
    })
  },

  register(data: RegisterRequest): Promise<AxiosResponse>{
    return api.post('/auth/register', data)
  },

  me(): Promise<AxiosResponse<User>>  {
    return api.get<User>('/auth/me')
  },

  logout() {
    return api.post('/auth/logout')
  },

  refresh(): Promise<{ data: { accessToken: string } }> {
    return api.post(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        {},
        { withCredentials: true, skipAuthRefresh: true }
      )
  }
}
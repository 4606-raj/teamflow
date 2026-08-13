import { api } from '@/shared/api/api'
import type { User } from '@/features/auth'
import type { AxiosResponse } from 'axios'

export const authApi = {
  login(data: any): Promise<AxiosResponse> {
    return api.post('/auth/login', data)
  },

  register(data: any): Promise<AxiosResponse>{
    return api.post('/auth/register', data)
  },

  me(): Promise<AxiosResponse<User>>  {
    return api.get<User>('/auth/me')
  },

  logout() {
    return api.post('/auth/logout')
  },
}
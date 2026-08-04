import { api } from '@/lib/api'
import type { User } from '@/types/auth.types'
import type { AxiosResponse } from 'axios'

export const authService = {
  login(data: any): Promise<AxiosResponse> {
    return api.post('/auth/login', data)
  },

//   register(data: RegisterDto) {
//     return api.post('/auth/register', data)
//   },

  me(): Promise<AxiosResponse<User>>  {
    return api.get<User>('/auth/me')
  },

  logout() {
    return api.post('/auth/logout')
  },
}
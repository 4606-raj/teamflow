import { api } from '@/lib/api'

export const authService = {
//   login(data: LoginDto) {
//     return api.post('/auth/login', data)
//   },

//   register(data: RegisterDto) {
//     return api.post('/auth/register', data)
//   },

  me() {
    return api.get('/auth/me')
  },

  logout() {
    return api.post('/auth/logout')
  },
}
import { api } from '@/shared/api/api'
import type { AxiosResponse } from 'axios'

export const invitationsApi = {
  accept(token: string): Promise<AxiosResponse> {
    return api.get(`/invitations/accept/${token}`)
  },

  reject(token: string): Promise<AxiosResponse> {
    return api.delete(`/invitations/${token}`)
  },
}
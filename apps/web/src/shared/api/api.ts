import { http } from '@/shared/api/http'
import type { AxiosRequestConfig } from 'axios'

export const api = {
  get: <T>(url: string, params?: object, config?: AxiosRequestConfig) =>
    http.get<T>(url, { params, ...config }),

  post: <T>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ) => http.post<T>(url, data, config),

  put: <T>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ) => http.put<T>(url, data, config),

  patch: <T>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ) => http.patch<T>(url, data, config),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    http.delete<T>(url, config),
}
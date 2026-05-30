import { http } from './http'

export const api = {
  get: <T>(url: string, params?: object) =>
    http.get<T>(url, { params }),

  post: <T>(url: string, data?: object) =>
    http.post<T>(url, data),

  put: <T>(url: string, data?: object) =>
    http.put<T>(url, data),

  patch: <T>(url: string, data?: object) =>
    http.patch<T>(url, data),

  delete: <T>(url: string) =>
    http.delete<T>(url),
}
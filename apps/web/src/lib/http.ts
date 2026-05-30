// lib/http.ts

import axios from 'axios'
import { toast } from 'sonner'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong'

    toast.error(
      Array.isArray(message) ? message[0] : message
    )

    return Promise.reject(error)
  }
)
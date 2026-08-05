import axios from 'axios'
import { toast } from 'sonner'
import { useAuthStore } from "@/features/auth/stores/auth.store";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

http.interceptors.request.use((config) => {
  // TODO:
  const token = useAuthStore.getState().accessToken
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

http.interceptors.response.use(
  (response) => response.data,
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

// Handle expired access token
http.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // If not 401 or already retried, reject
    if (
      error.response?.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }


    originalRequest._retry = true;


    try {
      // Call refresh endpoint
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {}, {
          withCredentials: true,
        }
      );

      const { accessToken } = response.data.data;
      const { refreshToken } = response.data.data;

      // Update zustand
      useAuthStore
        .getState()
        .setAccessToken(accessToken);

      useAuthStore
        .getState()
        .setRefreshToken(refreshToken);


      // Update failed request token
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      // Retry original request
      return http(originalRequest);

    } catch (refreshError) {

      console.log(refreshError, 'refreshError');
      
      
      // Refresh failed -> logout
      useAuthStore
        .getState()
        .logout();


      return Promise.reject(refreshError);
    }
  }
);
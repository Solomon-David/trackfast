// File path: /frontend/src/utils/axiosInstance.js
import axios from 'axios';
import { useUserStore } from '@/stores/userStore';



const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
})

// Request interceptor to add JWT token
instance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    const token = userStore.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor (optional: handle auth errors)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const userStore = useUserStore();
      userStore.logout()
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

export default instance

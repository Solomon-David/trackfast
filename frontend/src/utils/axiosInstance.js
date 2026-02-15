// File path: /frontend/src/utils/axiosInstance.js
import axios from 'axios'
import { useUserStore } from '@/stores/userStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ,
  withCredentials: false
})

// Helper to safely get token without JSON issues
function getSafeToken() {
  const raw = localStorage.getItem('token')
  if (!raw || raw === 'undefined' || raw === 'null') return null
  return raw
}

// --------------------------------------------------------
// REQUEST INTERCEPTOR — attaches token safely on every call
// --------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    const token = getSafeToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// --------------------------------------------------------
// RESPONSE INTERCEPTOR — auto logout on expired token
// --------------------------------------------------------
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      // Avoid store import loops
      const userStore = useUserStore()
      userStore.logout()
    }

    return Promise.reject(error)
  }
)

export default api

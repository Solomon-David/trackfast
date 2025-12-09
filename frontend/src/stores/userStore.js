import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from '@/utils/axiosInstance'

export const useUserStore = defineStore('userStore', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)

  const isLoggedIn = computed(() => !!token.value)

  const saveToStorage = () => {
    localStorage.setItem('user', JSON.stringify(user.value))
    localStorage.setItem('token', token.value)
  }

  const verifyAccount = async (email, code) => {
  try {
    const res = await axios.post("/auth/verify-account", { email, code });

    return { success: true, message: res.data.message };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Verification failed"
    };
  }
}

  const loginByVerification = (theUser, theToken) =>{
  user.value = theUser;
  token.value = theToken;
  saveToStorage()

}


  const login = async ({ email, password }) => {
    loading.value = true
    try {
      const res = await axios.post('/auth/login', { email, password })
      user.value = res.data.user
      token.value = res.data.token
      saveToStorage()
      return res.data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const register = async ({ fullName, email, password, phone }) => {
    loading.value = true
    try {
      const res = await axios.post('/auth/register', { fullName, email, password, phone })
      return res.data
    } catch (error) {
      console.error('Register error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const loadUserFromStorage = () => {
    user.value = JSON.parse(localStorage.getItem('user')) || null
    token.value = localStorage.getItem('token') || null
  }

  return { user, token, verifyAccount, loginByVerification, loading, isLoggedIn, login, register, logout, loadUserFromStorage }
})

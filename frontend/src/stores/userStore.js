import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from '@/utils/axiosInstance'

export const useUserStore = defineStore('userStore', () => {
  // ---------------------------
  // SAFE LOADER FOR LOCALSTORAGE
  // ---------------------------
  function safeLoad(key, json = true) {
    const raw = localStorage.getItem(key)

    // handle empty or invalid stored values
    if (!raw || raw === 'undefined' || raw === 'null') {
      return null
    }

    if (!json) return raw

    try {
      return JSON.parse(raw)
    } catch (e) {
      console.warn(`Invalid JSON removed from ${key}:`, raw)
      localStorage.removeItem(key)
      return null
    }
  }

  // ---------------------------
  // STATE
  // ---------------------------
  const user = ref(safeLoad('user'))
  const token = ref(safeLoad('token', false))
  const loading = ref(false)

  const isLoggedIn = computed(() => !!token.value)

  // ---------------------------
  // SAVE TO STORAGE
  // ---------------------------
  const saveToStorage = () => {
    localStorage.setItem('user', JSON.stringify(user.value))
    localStorage.setItem('token', token.value || '')
  }

  // ---------------------------
  // VERIFY ACCOUNT
  // ---------------------------
  const verifyAccount = async (email, code) => {
    try {
      const res = await axios.post('/auth/verify-account', { email, code })
      return { success: true, message: res.data.message }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Verification failed'
      }
    }
  }

  // ---------------------------
  // LOGIN AFTER VERIFICATION
  // ---------------------------
  const loginByVerification = (theUser, theToken) => {
    user.value = theUser
    token.value = theToken
    saveToStorage()
  }

  // ---------------------------
  // LOGIN 
  // ---------------------------
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

  // ---------------------------
  // REGISTER
  // ---------------------------
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

  // ---------------------------
  // LOGOUT
  // ---------------------------
  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  // ---------------------------
  // LOAD AUTH ON APP START
  // ---------------------------
  const loadUserFromStorage = () => {
    user.value = safeLoad('user')
    token.value = safeLoad('token', false)
  }

  //Contact
  // TODO: fix the contact us section
  const contactUs = async (fullName, email, message) => {
    loadUserFromStorage();
    const name = fullName || user.value.fullName;
    const mail = email || user.value.email;
    await axios.post('/user/contact', { fullName: name, mail:email, message});
    return true;
  }

  const requestResetCode = async (email) => {
    
    let res = await axios.post("/auth/forgot-password", { email });
    console.log(res.data);
    return res.data;
  }

  const resetPassword = async (email, token, password) => {
    try {
      
      let res = await axios.post("/auth/reset-password", {email, token, password});
      return res;
    } catch (error) {
      throw error;
    }
  }

  const changePassword = async (password, newPassword) => {
    loadUserFromStorage();
    try {
      const res = await axios.post('/users/change-password', { email: user.value.email, password, newPassword });
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  return {
    user,
    token,
    loading,
    isLoggedIn,
    verifyAccount,
    loginByVerification,
    login,
    register,
    logout,
    loadUserFromStorage,
    requestResetCode,
    resetPassword,
    changePassword,
  }
})

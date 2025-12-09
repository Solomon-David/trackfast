// File path: /frontend/src/stores/adminStore.js
import { defineStore } from 'pinia'
import axios from '@/utils/axiosInstance'
import { ref } from 'vue'

export const useAdminStore = defineStore('adminStore', () => {
  const users = ref([])
  const staffActivityLogs = ref([])
  const loading = ref(false)

  const getAllUsers = async () => {
    loading.value = true
    try {
      const res = await axios.get('/admin/users')
      users.value = res.data
      return res.data
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const getStaffActivityLogs = async () => {
    loading.value = true
    try {
      const res = await axios.get('/admin/staff-activity')
      staffActivityLogs.value = res.data
      return res.data
    } catch (error) {
      console.error('Error fetching staff activity logs:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const getDashboardStats = async () => {
    try {
      const res = await axios.get('/admin/dashboard')
      return res.data
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    }
  }

  return { users, staffActivityLogs, loading, getAllUsers, getStaffActivityLogs, getDashboardStats }
})

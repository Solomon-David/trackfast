// File path: /frontend/src/stores/staffStore.js
import { defineStore } from 'pinia'
import axios from '@/utils/axiosInstance'
import { ref } from 'vue'

export const useStaffStore = defineStore('staffStore', () => {
  const staffList = ref([])
  const loading = ref(false)

  const getAllStaff = async () => {
    loading.value = true
    try {
      const res = await axios.get('/staff/all')
      staffList.value = res.data
      return res.data
    } catch (error) {
      console.error('Error fetching staff list:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const createStaff = async (payload) => {
    loading.value = true
    try {
      const res = await axios.post('/staff/create', payload)
      staffList.value.push(res.data.staff)
      return res.data
    } catch (error) {
      console.error('Error creating staff:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return { staffList, loading, getAllStaff, createStaff }
})

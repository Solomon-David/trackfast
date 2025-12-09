// File path: /frontend/src/stores/pickupStore.js
import { defineStore } from 'pinia'
import axios from '@/utils/axiosInstance'
import { ref } from 'vue'

export const usePickupStore = defineStore('pickupStore', () => {
  const pickups = ref([])
  const loading = ref(false)

  const getPickupRequests = async () => {
    loading.value = true
    try {
      const res = await axios.get('/pickups/all')
      pickups.value = res.data
      return res.data
    } catch (error) {
      console.error('Error fetching pickups:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const createPickupRequest = async (payload) => {
    loading.value = true
    try {
      const res = await axios.post('/pickups/create', payload)
      pickups.value.push(res.data)
      return res.data
    } catch (error) {
      console.error('Error creating pickup request:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const getPickupStats = async () => {
    try {
      const res = await axios.get('/pickups/stats')
      return res.data
    } catch (error) {
      console.error('Error fetching pickup stats:', error)
      throw error
    }
  }

  return { pickups, loading, getPickupRequests, createPickupRequest, getPickupStats }
})

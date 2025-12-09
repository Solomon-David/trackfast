// File path: /frontend/src/stores/trackingStore.js
import { defineStore } from 'pinia'
import axios from '@/utils/axiosInstance'
import { ref } from 'vue'

export const useTrackingStore = defineStore('trackingStore', () => {
  const trackingEvents = ref([])
  const loading = ref(false)

  const getTrackingEventsByNumber = async (trackingNumber) => {
    loading.value = true
    try {
      const res = await axios.get(`/tracking/${trackingNumber}`)
      trackingEvents.value = res.data
      return res.data
    } catch (error) {
      console.error('Error fetching tracking events:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const getAllTrackingEvents = async () => {
    loading.value = true
    try {
      const res = await axios.get('/tracking')
      trackingEvents.value = res.data
      return res.data
    } catch (error) {
      console.error('Error fetching all tracking events:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return { trackingEvents, loading, getTrackingEventsByNumber, getAllTrackingEvents }
})

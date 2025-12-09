// File path: /frontend/src/stores/shipmentStore.js
import { defineStore } from 'pinia'
import axios from '@/utils/axiosInstance'
import { ref } from 'vue'

export const useShipmentStore = defineStore('shipmentStore', () => {
  const shipments = ref([])
  const currentShipment = ref(null)
  const loading = ref(false)

  const getMyShipments = async () => {
    loading.value = true
    try {
      const res = await axios.get('/shipments/my-shipments')
      shipments.value = res.data
    } catch (error) {
      console.error('Error fetching shipments:', error)
    } finally {
      loading.value = false
    }
  }

  const createShipment = async (payload) => {
    loading.value = true
    try {
      const res = await axios.post('/shipments/create', payload)
      shipments.value.push(res.data)
      return res.data
    } catch (error) {
      console.error('Error creating shipment:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const getShipmentById = async (id) => {
    loading.value = true
    try {
      const res = await axios.get(`/shipments/details/${id}`)
      currentShipment.value = res.data
      return res.data
    } catch (error) {
      console.error('Error fetching shipment details:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return { shipments, currentShipment, loading, getMyShipments, createShipment, getShipmentById }
})

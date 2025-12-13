// File path: /frontend/src/stores/shipmentStore.js
import { defineStore } from 'pinia'
import axios from '@/utils/axiosInstance'
import { ref } from 'vue'

export const useShipmentStore = defineStore('shipmentStore', () => {
  const shipments = ref([])
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

  const getShipmentByTrackingNumber = async (trackingNumber) => {
    loading.value = true
    try {
      console.log("Fetched shipment details:", trackingNumber);
      const res = await axios.post(`/shipments/details`,{trackingNumber});
      return res.data;
    } catch (error) {
      console.error('Error fetching shipment details:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateShipmentStatus = async (trackingNumber, status, currentLocation, deliveryDate) => {
    loading.value = true
    try {
      const res = await axios.post('/shipments/update-status', { trackingNumber, status, currentLocation, deliveryDate });
      return res.data
    } catch (error) {
      console.error('Error updating shipment status:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const sendReceiptEmail = async (image, email, trackingNumber, message) => {
    loading.value = true
    try {
      let result = await axios.post('/shipments/send-receipt', { image, email, trackingNumber, message });
      return result.data;
    } catch (error) {
      console.error('Error sending receipt email:', error)
      throw error
    } finally {
      loading.value = false;
    }
  }

  const getAllShipments = async () => {
    loading.value = true;
    try {
      const res = await axios.get('/shipments/all');
      shipments.value = res.data;
    } catch (error) {
      console.error('Error fetching all shipments:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  const deleteShipment = async (trackingNumber) => {
    loading.value = true;
    try {
      await axios.delete(`/shipments/delete/${trackingNumber}`);
      shipments.value = shipments.value.filter(shipment => shipment.trackingNumber !== trackingNumber);
    } catch (error) {
      console.error('Error deleting shipment:', error);
      throw error;
    } finally {
      loading.value = false;
    } 
  }


  return { shipments, loading, getMyShipments, getShipmentByTrackingNumber, createShipment, updateShipmentStatus, sendReceiptEmail, getAllShipments, deleteShipment  }
})

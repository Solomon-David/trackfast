// File path: /frontend/src/stores/transactionStore.js
import { defineStore } from 'pinia'
import axios from '@/utils/axiosInstance'
import { ref } from 'vue'

export const useTransactionStore = defineStore('transactionStore', () => {
  const transactions = ref([])
  const loading = ref(false)

  const getMyTransactions = async () => {
    loading.value = true
    try {
      const res = await axios.get('/transactions/my-transactions')
      transactions.value = res.data
      return res.data
    } catch (error) {
      console.error('Error fetching transactions:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`/transactions/${id}`)
      transactions.value = transactions.value.filter(t => t._id !== id)
    } catch (error) {
      console.error('Error deleting transaction:', error)
      throw error
    }
  }

  return { transactions, loading, getMyTransactions, deleteTransaction }
})

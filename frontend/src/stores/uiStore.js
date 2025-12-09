// File path: /frontend/src/stores/uiStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('uiStore', () => {
  const loading = ref(false)
  const snackbar = ref({ show: false, message: '', color: 'info' })
  const dialog = ref({ show: false, title: '', payload: null })

  const showSnackbar = (message, color = 'info') => {
    snackbar.value = { show: true, message, color }
  }

  const hideSnackbar = () => {
    snackbar.value.show = false
  }

  const openDialog = (title, payload = null) => {
    dialog.value = { show: true, title, payload }
  }

  const closeDialog = () => {
    dialog.value.show = false
  }

  return { loading, snackbar, dialog, showSnackbar, hideSnackbar, openDialog, closeDialog }
})

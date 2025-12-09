<template>
  <v-app-bar app elevation="2" class="px-4">
    <v-app-bar-nav-icon @click="toggleDrawer" class="mr-2" />

    <v-toolbar-title class="font-weight-bold text-h5">
      Track Fast Logistics
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <div v-if="!isLoggedIn">
      <v-btn to="/auth/login" variant="text">Login</v-btn>
      <v-btn to="/auth/register" color="primary" variant="flat">Sign Up</v-btn>
    </div>

    <div v-else class="d-flex align-center">
      <v-btn to="/user/dashboard" variant="text">Dashboard</v-btn>
      <v-btn @click="logout" color="error" variant="flat">Logout</v-btn>
    </div>
  </v-app-bar>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

// const isLoggedIn = computed(() => userStore.isLoggedIn)
const isLoggedIn = false;

const toggleDrawer = () => {
  // Emit to MainLayout to open the drawer
  // You will implement drawer logic in MainLayout
  // Example: emit('toggle-drawer') if using props/emits
}

const logout = () => {
  userStore.logout()
  router.push('/')
}
</script>

<style scoped>
</style>

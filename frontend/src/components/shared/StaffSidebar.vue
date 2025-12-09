// File path: /frontend/src/components/shared/StaffSidebar.vue
<template>
  <v-navigation-drawer v-if="isLoggedIn" v-model="drawer" app :mini-variant="mini" permanent>
    <v-list>
      <v-list-item>
        <v-btn icon @click="toggleMini">
          <v-icon>{{ mini ? 'mdi-menu-open' : 'mdi-menu' }}</v-icon>
        </v-btn>
        <v-list-item-title class="text-h6" v-if="!mini">Staff Menu</v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item link to="/staff/dashboard">
        <v-list-item-icon><v-icon>mdi-view-dashboard</v-icon></v-list-item-icon>
        <v-list-item-title v-if="!mini">Dashboard</v-list-item-title>
      </v-list-item>

      <v-list-item link to="/staff/pickups">
        <v-list-item-icon><v-icon>mdi-truck-delivery</v-icon></v-list-item-icon>
        <v-list-item-title v-if="!mini">Pickup Requests</v-list-item-title>
      </v-list-item>

      <v-list-item link to="/staff/update-status">
        <v-list-item-icon><v-icon>mdi-package-variant-closed</v-icon></v-list-item-icon>
        <v-list-item-title v-if="!mini">Update Shipment Status</v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item @click="logout">
        <v-list-item-icon><v-icon>mdi-logout</v-icon></v-list-item-icon>
        <v-list-item-title v-if="!mini">Logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const isLoggedIn = computed(() => userStore.isLoggedIn)
const drawer = ref(true)
const mini = ref(false)

const toggleMini = () => {
  mini.value = !mini.value
}

const logout = () => {
  userStore.logout()
  router.push('/')
}
</script>

<style scoped>
.v-navigation-drawer--mini-variant {
  width: 64px;
}
</style>

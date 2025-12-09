// File path: /frontend/src/components/shared/AdminSidebar.vue
<template>
  <v-navigation-drawer v-if="isLoggedIn" v-model="drawer" app :mini-variant="mini" permanent>
    <v-list>
      <v-list-item>
        <v-btn icon @click="toggleMini">
          <v-icon>{{ mini ? 'mdi-menu-open' : 'mdi-menu' }}</v-icon>
        </v-btn>
        <v-list-item-title class="text-h6" v-if="!mini">Admin Menu</v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item link to="/admin/dashboard">
        <v-list-item-icon><v-icon>mdi-view-dashboard</v-icon></v-list-item-icon>
        <v-list-item-title v-if="!mini">Dashboard</v-list-item-title>
      </v-list-item>

      <v-list-item link to="/admin/users">
        <v-list-item-icon><v-icon>mdi-account-group</v-icon></v-list-item-icon>
        <v-list-item-title v-if="!mini">Users</v-list-item-title>
      </v-list-item>

      <v-list-item link to="/admin/create-staff">
        <v-list-item-icon><v-icon>mdi-account-plus</v-icon></v-list-item-icon>
        <v-list-item-title v-if="!mini">Create Staff</v-list-item-title>
      </v-list-item>

      <v-list-item link to="/admin/activity">
        <v-list-item-icon><v-icon>mdi-file-document-box-multiple</v-icon></v-list-item-icon>
        <v-list-item-title v-if="!mini">Staff Activity Logs</v-list-item-title>
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

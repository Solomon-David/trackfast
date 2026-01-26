// File path: /frontend/src/components/shared/Navbar.vue
<template>
  <v-app-bar app elevation="2" class="px-4">
    <v-app-bar-nav-icon @click="toggleDrawer" v-if="isLoggedIn" />
    <!-- Logo + Title -->
    <v-btn variant="text" class="d-flex align-center" to="/">
      <v-img
        src="/src/assets/logo.png"
        alt="TrackFast Logo"
        width="32"
        height="32"
        class="me-2"
        contain
      ></v-img>

      <span class="text-h6 font-weight-bold">TrackFast Logistics</span>
    </v-btn>
    <v-spacer></v-spacer>

    <div v-if="!isLoggedIn">
      <v-btn to="/auth/login" variant="text">Login</v-btn>
      <v-btn to="/auth/register" color="primary" variant="flat">Sign Up</v-btn>
    </div>

    <div v-else class="d-flex align-center">
      <v-spacer class="pa-3"></v-spacer>
      <v-btn @click="logout" color="error" variant="flat">Logout</v-btn>
    </div>
  </v-app-bar>
</template>

<script setup>
import { computed, defineProps, inject } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";

const toggleDrawer = inject("toggleDrawer");

const userStore = useUserStore();
const router = useRouter();
const isLoggedIn = computed(() => userStore.isLoggedIn);

const logout = () => {
  userStore.logout();
  router.push("/");
};
</script>

<style scoped></style>

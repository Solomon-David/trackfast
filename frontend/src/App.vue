<!-- /frontend/src/App.vue -->
<template>
  <v-app>
    <Suspense>
      <router-view />
    </Suspense>
  </v-app>
</template>

<script setup>
import { ref, provide } from "vue";
const drawer = ref(false);
const toggleDrawer = () => (drawer.value = !drawer.value);

provide("drawer", drawer);
provide("toggleDrawer", toggleDrawer);
</script>

<style>
/* Global styles if needed */
</style>

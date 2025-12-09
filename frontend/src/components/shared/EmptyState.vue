// File path: /frontend/src/components/shared/EmptyState.vue
<template>
  <v-container class="text-center py-10">
    <v-icon large color="grey lighten-1">mdi-inbox</v-icon>
    <div class="text-h6 mt-4">{{ message }}</div>
  </v-container>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  message: { type: String, default: 'No data available' }
})
</script>

<style scoped>
</style>

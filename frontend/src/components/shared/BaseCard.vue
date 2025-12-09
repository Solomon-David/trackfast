// File path: /frontend/src/components/shared/BaseCard.vue
<template>
  <v-card :elevation="elevation" class="pa-4">
    <slot />
  </v-card>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  elevation: { type: Number, default: 2 }
})
</script>

<style scoped>
</style>

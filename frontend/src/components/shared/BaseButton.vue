// File path: /frontend/src/components/shared/BaseButton.vue
<template>
  <v-btn :color="color" :variant="variant" :disabled="disabled" @click="$emit('click')">
    <slot />
  </v-btn>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  color: { type: String, default: 'primary' },
  variant: { type: String, default: 'flat' },
  disabled: { type: Boolean, default: false }
})
</script>

<style scoped>
</style>

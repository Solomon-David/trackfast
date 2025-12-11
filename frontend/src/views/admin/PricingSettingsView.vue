<template>
  <v-container>
    <h1>Pricing Settings</h1>

    <v-form @submit.prevent="save">

      <v-text-field v-model="local.basePrice" label="Base Price" type="number" required />
      <v-text-field v-model="local.pricePerKg" label="Price per KG" type="number" required />
      <v-text-field v-model="local.pricePerKm" label="Price per KM" type="number" required />
      <v-text-field v-model="local.volumetricDivisor" label="Volumetric Divisor" type="number" required />
      <v-text-field v-model="local.minimumPrice" label="Minimum Price" type="number" required />

      <v-btn color="primary" type="submit" :loading="pricingStore.loading">
        Save Settings
      </v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { usePricingSettingsStore } from "@/stores/pricingSettingsStore";

const pricingStore = usePricingSettingsStore();
const local = ref({});

onMounted(async () => {
  await pricingStore.fetchSettings();
  local.value = { ...pricingStore.settings };
});

// Keep local copy updated
watch(
  () => pricingStore.settings,
  (val) => {
    if (val) local.value = { ...val };
  }
);

const save = async () => {
  const ok = await pricingStore.updateSettings(local.value);
  if (ok) alert("Pricing settings updated.");
};
</script>

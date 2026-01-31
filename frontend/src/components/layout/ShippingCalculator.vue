<script setup>
import { ref, computed, watchEffect } from "vue";
const loading = ref(false);
import { usePricingSettingsStore } from "@/stores/pricingSettingsStore";
import { useShipmentCalculator } from "@/composables/useShipmentCalculator";
import { getAddress } from "@/utils/radarInstance";

usePricingSettingsStore().fetchSettings();
// Cities
const senderCity = ref("");
const senderCountry = ref("");
const receiverCity = ref("");
const receiverCountry = ref("");
const sameCity = ref(false);

// Locations
const senderAddress = ref(null);
const receiverAddress = ref(null);

// Dimensional fields
const length = ref();
const width = ref();
const height = ref();

// Weight
const weight = ref();

// Result
const estimatedCost = ref(null);

// Auto-calculated volume
const volume = computed(() => {
  const L = length.value || 0;
  const W = width.value || 0;
  const H = height.value || 0;
  return L * W * H;
});

// Use the composable
const { calculateCost: composableCalculateCost } = useShipmentCalculator();

// Calculate cost
async function calculateCost() {
  if (!sameCity.value && (!senderCity.value || !receiverCity.value)) {
    estimatedCost.value = "Missing city fields";
    return;
  }

  loading.value = true;

  receiverCity.value = sameCity.value ? senderCity.value : receiverCity.value;
  receiverCountry.value = sameCity.value ? senderCountry.value : receiverCountry.value;
  try {
    if (!senderAddress.value) {
      await getSenderLocation();
    }
    if (!receiverAddress.value) {
      await getReceiverLocation();
    }

    estimatedCost.value = await composableCalculateCost({
      length: length.value,
      width: width.value,
      height: height.value,
      weight: weight.value,
      withInsurance: false,
      senderAddress: senderAddress.value,
      receiverAddress: receiverAddress.value,
    });
  } catch (err) {
    console.error("Error calculating shipment cost:", err);
    estimatedCost.value = "Error calculating cost";
  } finally {
    loading.value = false;
  }
}

async function getSenderLocation() {
  if (senderCity.value && senderCountry.value) {
    senderAddress.value = await getAddress(senderCity.value, senderCountry.value);
    console.log("Sender Address: ", `${senderCity.value}, ${senderCountry.value}`);
  }
}

async function getReceiverLocation() {
  if (receiverCity.value && receiverCountry.value) {
    receiverAddress.value = await getAddress(receiverCity.value, receiverCountry.value);
    console.log("Receiver Address: ", `${receiverCity.value}, ${receiverCountry.value}`);
  }
}
</script>

<template>
  <!-- Shipping Calculator -->
  <h3 class="text-h6 font-weight-bold mb-4">Shipment Cost Calculator</h3>

  <div class="d-flex ga-6">
    <!-- Sender City -->
    <v-text-field
      v-model="senderCity"
      @blur="getSenderLocation()"
      label="Sender City"
      variant="outlined"
      clearable
    />

    <!-- Sender Country -->
    <v-text-field
      v-model="senderCountry"
      label="Sender Country"
      @blur="getSenderLocation()"
      variant="outlined"
      clearable
    />
  </div>

  <!-- Same City Checkbox -->
  <v-checkbox
    v-model="sameCity"
    @blur="getReceiverLocation()"
    label="Same City Delivery"
    class="mt-n3"
  ></v-checkbox>

  <div class="d-flex ga-6">
    <!-- Receiver City -->
    <v-text-field
      v-model="receiverCity"
      label="Receiver's City"
      variant="outlined"
      clearable
      :disabled="sameCity"
    />
    <!-- Receiver City -->
    <v-text-field
      v-model="receiverCountry"
      label="Receiver's Country"
      @blur="getReceiverLocation()"
      variant="outlined"
      clearable
      :disabled="sameCity"
    />
  </div>
  <span> Package Dimensions</span>
  <!-- Dimensional Fields -->
  <div class="d-flex ga-3 mt-3">
    <v-text-field v-model="length" label="Length (cm)" type="number" variant="outlined" />
    <v-text-field v-model="width" label="Width (cm)" type="number" variant="outlined" />
    <v-text-field v-model="height" label="Height (cm)" type="number" variant="outlined" />
  </div>

  <!-- Weight -->
  <v-text-field v-model="weight" label="Weight (kg)" variant="outlined" type="number" />
  <!-- Calculate -->
  <v-btn block color="primary" class="mt-3" :loading="loading" @click="calculateCost">
    Calculate Cost
  </v-btn>

  <!-- Result -->
  <div v-if="estimatedCost" class="mt-4 text-center">
    <h3 class="text-h6 font-weight-bold">Estimated Cost:</h3>
    <p class="text-h6 mt-1">${{ estimatedCost }}</p>
  </div>
</template>

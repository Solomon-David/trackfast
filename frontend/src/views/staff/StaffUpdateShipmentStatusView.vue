// File path: /frontend/src/views/staff/StaffUpdateShipmentStatusView.vue
<template>
  <v-container>
    <h1>Update Shipment Status</h1>

    <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>
    <v-alert v-if="success" type="success" class="mb-4">{{ success }}</v-alert>

    <v-form @submit.prevent="updateStatus">
      <v-text-field
        v-model="trackingNumber"
        label="Tracking Number"
        required
        @blur="fetchShipmentDetails"
        @keyup.enter="fetchShipmentDetails"
        :loading="fetchingShipment"
      />

      <div v-if="shipmentLoaded" class="mb-4">
        <v-card class="pa-4">
          <p><strong>Current Status:</strong> {{ currentShipment?.status }}</p>
          <p><strong>Current Location:</strong> {{ currentShipment?.currentLocation }}</p>
          <p><strong>Receiver:</strong> {{ currentShipment?.receiver?.name }}</p>
          <p><strong>Description:</strong> {{ currentShipment?.package?.description }}</p>
        </v-card>
      </div>

      <v-select
        v-model="status"
        :items="statuses"
        label="Status"
        required
        :disabled="!shipmentLoaded"
      />
      <v-text-field
        v-model="currentLocation"
        label="Change Location"
        :disabled="!shipmentLoaded"
      />
      <v-btn
        type="submit"
        color="primary"
        :loading="shipmentStore.loading"
        :disabled="!shipmentLoaded"
        >Update</v-btn
      >
    </v-form>
  </v-container>
</template>
<style scoped>
h1 {
  margin-bottom: 2rem;
  color: #333;
}

v-container {
  max-width: 600px;
}
</style>

<script setup>
import { ref } from "vue";
import { useShipmentStore } from "@/stores/shipmentStore";

const shipmentStore = useShipmentStore();

const trackingNumber = ref("");
const status = ref("");
const currentLocation = ref("");
const fetchingShipment = ref(false);
const shipmentLoaded = ref(false);
const error = ref(null);
const success = ref(null);

const statuses = [
  "pending",
  "received",
  "in-transit",
  "out-for-delivery",
  "delivered",
  "cancelled",
];

const currentShipment = ref(null);

const fetchShipmentDetails = async () => {
  console.log("Fetching shipment for tracking number:", trackingNumber.value);
  if (!trackingNumber.value.trim()) {
    shipmentLoaded.value = false;
    error.value = null;
    return;
  }

  fetchingShipment.value = true;
  error.value = null;
  try {
    // Fetch shipment by tracking number
    const res = await shipmentStore.getShipmentByTrackingNumber(
      trackingNumber.value.trim()
    );
    currentShipment.value = res;
    if (currentShipment) {
      status.value = currentShipment.status || "pending";
      currentLocation.value = currentShipment.currentLocation || "";
      shipmentLoaded.value = true;
    }
  } catch (err) {
    shipmentLoaded.value = false;
    error.value = err.response?.data?.message || "Shipment not found";
    console.error("Error fetching shipment:", err);
  } finally {
    fetchingShipment.value = false;
  }
};

const updateStatus = async () => {
  try {
    const result = await shipmentStore.updateShipmentStatus(
      trackingNumber.value,
      status.value,
      currentLocation.value
    );

    console.log("Update result:", result);
    console.log("Current values:", {
      currentLocation: currentLocation.value,
      status: status.value,
    });

    if (result?.success) {
      success.value = "Shipment updated successfully";
    } else {
      error.value = "Failed to update shipment";
    }
    fetchShipmentDetails();
  } catch (err) {
    error.value = err.response?.data?.message || "Error updating shipment";
    console.error("Error updating shipment:", err);
  }
};
</script>

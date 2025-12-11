// File path: /frontend/src/views/shipment/ShipmentDetailsView.vue
<template>
  <v-container>
    <h1>Shipment Details</h1>

    <div v-if="loading" class="text-center my-6">
      <v-progress-circular indeterminate size="48" />
    </div>

    <div v-else-if="error" class="my-6">
      <v-alert type="error" closable>{{ error }}</v-alert>
    </div>

    <v-card v-else class="pa-4">
      <v-row>
        <v-col cols="12" md="6">
          <h3 class="mb-4">General Information</h3>
          <p><strong>Tracking Number:</strong> {{ shipment.trackingNumber }}</p>
          <p>
            <strong>Status:</strong>
            <v-chip :color="getStatusColor(shipment.status)">{{
              shipment.status
            }}</v-chip>
          </p>
          <p><strong>Current Location:</strong> {{ shipment.currentLocation }}</p>
          <p v-if="shipment.createdAt">
            <strong>Created:</strong> {{ formatDate(shipment.createdAt) }}
          </p>
        </v-col>
        <v-col cols="12" md="6">
          <h3 class="mb-4">Package Information</h3>
          <p><strong>Weight:</strong> {{ shipment.package?.weight }} kg</p>
          <p v-if="shipment.package?.dimensions">
            <strong>Dimensions:</strong> {{ shipment.package.dimensions.length }} ×
            {{ shipment.package.dimensions.width }} ×
            {{ shipment.package.dimensions.height }} cm
          </p>
          <p v-if="shipment.package?.description">
            <strong>Description:</strong> {{ shipment.package.description }}
          </p>
        </v-col>
      </v-row>

      <v-divider class="my-6" />

      <v-row>
        <v-col cols="12" md="6">
          <h3 class="mb-4">Sender Information</h3>
          <p v-if="shipment.sender"><strong>Name:</strong> {{ shipment.sender.name }}</p>
          <p v-if="shipment.sender">
            <strong>Address:</strong> {{ shipment.sender.address }}
          </p>
          <p v-if="shipment.sender">
            <strong>Phone:</strong> {{ shipment.sender.phone }}
          </p>
        </v-col>
        <v-col cols="12" md="6">
          <h3 class="mb-4">Receiver Information</h3>
          <p v-if="shipment.receiver">
            <strong>Name:</strong> {{ shipment.receiver.name }}
          </p>
          <p v-if="shipment.receiver">
            <strong>Address:</strong> {{ shipment.receiver.address }}
          </p>
          <p v-if="shipment.receiver">
            <strong>Phone:</strong> {{ shipment.receiver.phone }}
          </p>
        </v-col>
      </v-row>

      <v-divider class="my-6" />

      <v-row v-if="shipment.price">
        <v-col cols="12">
          <h3 class="mb-4">Pricing</h3>
          <p><strong>Price:</strong> ₦{{ shipment.price }}</p>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useShipmentStore } from "@/stores/shipmentStore";

const route = useRoute();
const shipmentStore = useShipmentStore();

const loading = ref(false);
const error = ref(null);
const shipment = computed(() => shipmentStore.currentShipment || {});

const getStatusColor = (status) => {
  const statusColors = {
    pending: "orange",
    received: "blue",
    "in-transit": "blue",
    "out-for-delivery": "info",
    delivered: "green",
    cancelled: "red",
  };
  return statusColors[status?.toLowerCase()] || "grey";
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(async () => {
  const shipmentId = route.params.id;
  if (shipmentId) {
    loading.value = true;
    try {
      await shipmentStore.getShipmentById(shipmentId);
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to load shipment details";
      console.error("Error loading shipment:", err);
    } finally {
      loading.value = false;
    } 
  }
});
</script>

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
          <p><strong>Tracking Number:</strong> {{ shipment?.trackingNumber }}</p>
          <p>
            <strong>Status: </strong>
            <span
              :style="{ color: getStatusColor(shipment?.status) }"
              class="text-capitalize"
              >{{ shipment?.status }}</span
            >
          </p>
          <p><strong>Current Location:</strong> {{ shipment?.currentLocation }}</p>
          <p v-if="shipment?.createdAt">
            <strong>Created:</strong> {{ formatDate(shipment?.createdAt) }}
          </p>
          <p v-if="shipment?.deliveryDate">
            <strong>Delivery Date:</strong> {{ formatDate(shipment?.deliveryDate) }}
          </p>
        </v-col>
        <v-col cols="12" md="6">
          <h3 class="mb-4">Package Information</h3>
          <p><strong>Weight:</strong> {{ shipment?.package?.weight }} kg</p>
          <p v-if="shipment?.package?.dimensions">
            <strong>Dimensions:</strong> {{ shipment?.package.dimensions.length }} ×
            {{ shipment?.package.dimensions.width }} ×
            {{ shipment?.package.dimensions.height }} cm
          </p>
          <p v-if="shipment?.package?.description">
            <strong>Description:</strong> {{ shipment?.package.description }}
          </p>
        </v-col>
      </v-row>

      <v-divider class="my-6" />

      <v-row>
        <v-col cols="12" md="6">
          <h3 class="mb-4">Sender Information</h3>
          <p><strong>Name:</strong> {{ shipment?.sender.name }}</p>
          <p>
            <strong>Address:</strong> {{ shipment?.sender.address }},
            {{ shipment?.package.senderCity }}
          </p>
          <p><strong>Email:</strong> {{ shipment?.sender.email }}</p>
        </v-col>
        <v-col cols="12" md="6">
          <h3 class="mb-4">Receiver Information</h3>
          <p><strong>Name:</strong> {{ shipment?.receiver.name }}</p>
          <p>
            <strong>Address:</strong> {{ shipment?.receiver.address }},
            {{ shipment?.package.receiverCity }}
          </p>
          <p><strong>Email:</strong> {{ shipment?.receiver.email }}</p>
        </v-col>
      </v-row>

      <v-divider class="my-6" />

      <v-row>
        <v-col cols="12">
          <p><strong>Cost:</strong> ${{ shipment?.cost }}</p>
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
const shipment = ref(null);

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
  console.log("Loading shipment details for ID:", route.params.trackingNumber);
  const shipmentId = route.params.trackingNumber;
  if (shipmentId) {
    loading.value = true;
    try {
      shipment.value = await shipmentStore.getShipmentByTrackingNumber(shipmentId);
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to load shipment details";
      console.error("Error loading shipment:", err);
    } finally {
      loading.value = false;
    }
  }
});
</script>

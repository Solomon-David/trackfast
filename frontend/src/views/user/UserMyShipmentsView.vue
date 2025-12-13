<template>
  <v-container>
    <div class="d-flex align-center justify-space-between">
      <h1>My Shipments</h1>

      <!-- NEW: Create Shipment Button (always visible) -->
      <v-btn color="primary" @click="goCreate" v-if="!shipments.length == 0">
        Create Shipment
      </v-btn>
    </div>

    <div v-if="loading">
      <v-row justify="center" class="my-6">
        <v-progress-circular size="48" />
      </v-row>
    </div>

    <div v-else-if="shipments.length == 0" class="my-6 text-center">
      <EmptyState message="You have no shipments yet." />
      <v-row justify="center" class="mt-4">
        <v-btn color="primary" @click="goCreate">Create Shipment</v-btn>
      </v-row>
    </div>

    <v-data-table
      v-else
      :headers="headers"
      :items="shipments"
      item-key="id"
      class="mt-4"
      hover
      @click:row="goDetails"
    >
      <template #item.status="{ item }">
        <v-chip :color="getStatusColor(item.status)" dark>
          {{ item.status }}
        </v-chip>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useShipmentStore } from "@/stores/shipmentStore";
import EmptyState from "@/components/shared/EmptyState.vue";

const shipmentStore = useShipmentStore();
const router = useRouter();

const headers = [
  { title: "Tracking Number", key: "trackingNumber" },
  { title: "Description", key: "description" },
  { title: "Status", key: "status" },
  { title: "Date Created", key: "createdAt" },
];

console.log("Shipments in store:", shipmentStore.shipments);

const shipments = computed(() =>
  shipmentStore.shipments.map((shipment) => ({
    trackingNumber: shipment.trackingNumber,
    description: shipment.package?.description || "N/A",
    status: shipment.status,
    createdAt: new Date(shipment.createdAt).toLocaleString(),
  }))
);

const getStatusColor = (status) => {
  const statusColors = {
    pending: "blue-grey",
    received: "orange",
    "in-transit": "blue",
    "out-for-delivery": "info",
    delivered: "green",
    cancelled: "red",
  };
  return statusColors[status?.toLowerCase()] || "grey";
};

const loading = computed(() => shipmentStore.loading);

const goCreate = () => {
  router.push("/shipments/create");
};

const goDetails = (event, item) => {
  router.push(`/shipments/details/${item.item.trackingNumber}`);
};

onMounted(async () => {
  await shipmentStore.getMyShipments();
});
</script>

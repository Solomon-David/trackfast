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

    <v-data-table v-else :headers="headers" :items="shipments" item-key="id" class="mt-4">
      <template #item.status="{ item }">
        <v-chip :color="item.status === 'Delivered' ? 'green' : 'blue'" dark>
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
];

const shipments = computed(() =>
  shipmentStore.shipments.map((shipment) => ({
    trackingNumber: shipment.trackingNumber,
    description: shipment.package?.description || "N/A",
    status: shipment.status,
  }))
);

const loading = computed(() => shipmentStore.loading);

const goCreate = () => {
  router.push("/shipments/create");
};

onMounted(() => {
  shipmentStore.getMyShipments();
});
</script>

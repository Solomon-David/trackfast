// File path: /frontend/src/views/staff/StaffPickupRequestsView.vue
<template>
  <v-container>
    <h1>Pickup Requests</h1>
    <v-data-table :headers="headers" :items="shipments" item-key="trackingNumber">
      <!-- Tracking Number -->
      <template #item.trackingNumber="{ item }">
        {{ item.trackingNumber }}
        <span
          ><v-icon @click="copyTrackingNumber($event, item)"
            >mdi-content-copy
          </v-icon></span
        >
      </template>
      <!-- Status -->
      <template #item.status="{ item }">
        <v-chip :color="item.status === 'Pending' ? 'orange' : 'green'" dark>
          {{ item.status }}
        </v-chip>
      </template>
      <!-- Actions -->
      <template #item.actions="{ item }">
        <v-menu>
          <template #activator="{ props }">
            <v-btn icon v-bind="props">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="goDetails($event, item)">
              <v-list-item-title>View Details</v-list-item-title>
            </v-list-item>
            <v-list-item @click="editShipment($event, item)">
              <v-list-item-title>Edit Shipment</v-list-item-title>
            </v-list-item>
            <v-list-item @click="deleteShipment($event, item)">
              <v-list-item-title>Delete Shipment</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <!-- Cost -->
      <template #item.cost="{ item }"> ${{ item.cost }} </template>
    </v-data-table>
  </v-container>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useShipmentStore } from "@/stores/shipmentStore";

const router = useRouter();
const shipmentStore = useShipmentStore();

// for copying numbers

await shipmentStore.getAllShipments();
const shipments = computed(() =>
  shipmentStore.shipments.map((shipment) => ({
    trackingNumber: shipment.trackingNumber,
    sender: shipment.sender,
    receiver: shipment.receiver,
    description: shipment.package?.description || "N/A",
    destination: shipment.package?.receiverCity,
    status: shipment.status,
    cost: shipment.cost,
    createdAt: new Date(shipment.createdAt).toLocaleString(),
  }))
);

const headers = [
  { title: "Tracking Number", value: "trackingNumber" },
  { title: "Sender", value: "sender.name" },
  { title: "Receiver", value: "receiver.name" },
  { title: "Destination", value: "destination" },
  { title: "Cost", value: "cost" },
  { title: "Status", value: "status" },
  { title: "Date Created", value: "createdAt" },
  { title: "Actions", value: "actions", sortable: false },
];

const goDetails = (event, item) => {
  router.push(`/shipments/details/${item.trackingNumber}`);
};

const editShipment = (event, item) => {
  router.push(`/shipments/update-status/${item.trackingNumber}`);
};

const deleteShipment = async (event, item) => {
  if (confirm(`Are you sure you want to delete shipment ${item.trackingNumber}?`)) {
    await shipmentStore.deleteShipment(item.trackingNumber);
    await shipmentStore.getAllShipments();
    alert("Deleted");
  }
};

// for copying tracking numbers
function copyTrackingNumber(event, item) {
  let list = event.target.classList;
  navigator.clipboard.writeText(item.trackingNumber);
  list.replace("mdi-content-copy", "mdi-clipboard-check-outline");
  setTimeout(() => {
    list.replace("mdi-clipboard-check-outline", "mdi-content-copy");
  }, 2000);
}
</script>

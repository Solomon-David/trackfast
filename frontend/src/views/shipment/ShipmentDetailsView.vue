// File path: /frontend/src/views/shipment/ShipmentDetailsView.vue
<template>
<v-container>
<h1>Shipment Details</h1>
<v-card class="pa-4">
<p><strong>Tracking Number:</strong> {{ shipment.trackingNumber }}</p>
<p><strong>Sender:</strong> {{ shipment.senderName }}</p>
<p><strong>Receiver:</strong> {{ shipment.receiverName }}</p>
<p><strong>Destination:</strong> {{ shipment.destination }}</p>
<p><strong>Status:</strong> {{ shipment.status }}</p>
<p><strong>Weight:</strong> {{ shipment.weight }} kg</p>
<p><strong>Dimensions:</strong> {{ shipment.dimensions }}</p>
</v-card>
</v-container>
</template>


<script setup>
import { ref } from 'vue';
const shipment = ref({
trackingNumber: 'TF123456',
senderName: 'John Doe',
receiverName: 'Jane Smith',
destination: 'Lagos',
status: 'In Transit',
weight: 5,
dimensions: '30x20x15 cm'
});
</script>
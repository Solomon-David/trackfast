

// File path: /frontend/src/views/user/UserMyShipmentsView.vue
<template>
<v-container>
<h1>My Shipments</h1>
<v-data-table :headers="headers" :items="shipments" item-key="id">
<template #item.status="{ item }">
<v-chip :color="item.status === 'Delivered' ? 'green' : 'blue'" dark>
{{ item.status }}
</v-chip>
</template>
</v-data-table>
</v-container>
</template>


<script setup>
import { ref } from 'vue';


const headers = [
{ text: 'Tracking Number', value: 'trackingNumber' },
{ text: 'Destination', value: 'destination' },
{ text: 'Status', value: 'status' },
];


const shipments = ref([
{ id: 1, trackingNumber: 'TF123456', destination: 'Lagos', status: 'In Transit' },
{ id: 2, trackingNumber: 'TF123457', destination: 'Abuja', status: 'Delivered' },
]);
</script>
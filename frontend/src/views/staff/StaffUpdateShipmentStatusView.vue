

// File path: /frontend/src/views/staff/StaffUpdateShipmentStatusView.vue
<template>
<v-container>
<h1>Update Shipment Status</h1>
<v-form @submit.prevent="updateStatus">
<v-text-field v-model="trackingNumber" label="Tracking Number" required />
<v-select v-model="status" :items="statuses" label="Status" required />
<v-btn type="submit" color="primary">Update</v-btn>
</v-form>
</v-container>
</template>


<script setup>
import { ref } from 'vue';
const trackingNumber = ref('');
const status = ref('In Transit');
const statuses = ['Pending', 'In Transit', 'Out for Delivery', 'Delivered'];


const updateStatus = () => {
console.log('Update shipment:', { trackingNumber: trackingNumber.value, status: status.value });
};
</script>


// File path: /frontend/src/views/shipment/TrackShipmentView.vue
<template>
<v-container>
<h1>Track Shipment</h1>
<v-form @submit.prevent="searchTracking">
<v-text-field v-model="trackingNumber" label="Tracking Number" required />
<v-btn type="submit" color="primary">Track</v-btn>
</v-form>


<div v-if="events.length" class="mt-6">
<h3>Tracking Events</h3>
<v-list>
<v-list-item v-for="event in events" :key="event.id">
<v-list-item-content>
<v-list-item-title>{{ event.status }}</v-list-item-title>
<v-list-item-subtitle>{{ event.timestamp }}</v-list-item-subtitle>
</v-list-item-content>
</v-list-item>
</v-list>
</div>
</v-container>
</template>


<script setup>
import { ref } from 'vue';
const trackingNumber = ref('');
const events = ref([]);


const searchTracking = () => {
console.log('Tracking number:', trackingNumber.value);
// Mock tracking events
events.value = [
{ id: 1, status: 'Picked up', timestamp: '2025-12-08 10:00' },
{ id: 2, status: 'In Transit', timestamp: '2025-12-08 14:00' },
];
};
</script>
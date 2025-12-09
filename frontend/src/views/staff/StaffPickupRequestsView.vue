

// File path: /frontend/src/views/staff/StaffPickupRequestsView.vue
<template>
<v-container>
<h1>Pickup Requests</h1>
<v-data-table :headers="headers" :items="pickups" item-key="id">
<template #item.status="{ item }">
<v-chip :color="item.status === 'Pending' ? 'orange' : 'green'" dark>
{{ item.status }}
</v-chip>
</template>
</v-data-table>
</v-container>
</template>


<script setup>
import { ref } from 'vue';


const headers = [
{ text: 'Pickup ID', value: 'id' },
{ text: 'Sender', value: 'sender' },
{ text: 'Destination', value: 'destination' },
{ text: 'Status', value: 'status' }
];


const pickups = ref([
{ id: 'PCK123', sender: 'John Doe', destination: 'Lagos', status: 'Pending' },
{ id: 'PCK124', sender: 'Alice Smith', destination: 'Abuja', status: 'Completed' }
]);
</script>
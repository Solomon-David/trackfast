// File path: /frontend/src/views/admin/AdminStaffActivityLogsView.vue
<template>
<v-container>
<h1>Staff Activity Logs</h1>
<v-data-table :headers="headers" :items="logs" item-key="id">
</v-data-table>
</v-container>
</template>


<script setup>
import { ref } from 'vue';
const headers = [
{ text: 'Staff Name', value: 'staffName' },
{ text: 'Action', value: 'action' },
{ text: 'Timestamp', value: 'timestamp' }
];

const logs = ref([
{ id: 1, staffName: 'Alice Smith', action: 'Updated shipment', timestamp: '2025-12-08 10:00' },
{ id: 2, staffName: 'Bob Johnson', action: 'Processed pickup', timestamp: '2025-12-08 11:00' }
]);
</script>
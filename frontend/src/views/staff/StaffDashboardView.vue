// File path: /frontend/src/views/staff/StaffDashboardView.vue
<template>
<v-container>
<h1>Staff Dashboard</h1>
<v-row>
<v-col cols="12" md="6">
<v-card class="pa-4">
<h2>Pickup Requests</h2>
<v-btn color="primary" @click="$router.push('/staff/pickups')">View Pickups</v-btn>
</v-card>
</v-col>
<v-col cols="12" md="6">
<v-card class="pa-4">
<h2>Update Shipment Status</h2>
<v-btn color="primary" @click="$router.push('/staff/update-status')">Update Status</v-btn>
</v-card>
</v-col>
</v-row>
</v-container>
</template>


<script setup>
</script>
// File path: /frontend/src/views/admin/AdminDashboardView.vue
<template>
<v-container>
<h1>Admin Dashboard</h1>
<v-row>
<v-col cols="12" md="4">
<v-card class="pa-4">
<h2>Total Users</h2>
<p>{{ stats.users }}</p>
</v-card>
</v-col>
<v-col cols="12" md="4">
<v-card class="pa-4">
<h2>Total Shipments</h2>
<p>{{ stats.shipments }}</p>
</v-card>
</v-col>
<v-col cols="12" md="4">
<v-card class="pa-4">
<h2>Total Revenue</h2>
<p>{{ stats.revenue }}</p>
</v-card>
</v-col>
</v-row>
</v-container>
</template>


<script setup>
import { ref } from 'vue';
const stats = ref({ users: 120, shipments: 450, revenue: 250000 });
</script>
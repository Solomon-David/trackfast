// File path: /frontend/src/views/user/UserDashboardView.vue
<template>
<v-container>
<h1>User Dashboard</h1>
<v-row>
<v-col cols="12" md="6">
<v-card class="pa-4">
<h2 class="text-h6">My Shipments</h2>
<v-btn color="primary" @click="$router.push('/user/shipments')">View Shipments</v-btn>
</v-card>
</v-col>
<v-col cols="12" md="6">
<v-card class="pa-4">
<h2 class="text-h6">My Transactions</h2>
<v-btn color="primary" @click="$router.push('/user/transactions')">View Transactions</v-btn>
</v-card>
</v-col>
</v-row>
</v-container>
</template>


<script setup>
    
</script>
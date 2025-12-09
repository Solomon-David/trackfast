

// File path: /frontend/src/components/layout/AppSidebar.vue
<template>
<v-navigation-drawer v-model="drawer" app>
<v-list density="comfortable">
<v-list-item to="/user/dashboard">
<v-list-item-title>User Dashboard</v-list-item-title>
</v-list-item>


<v-list-item to="/shipments/create">
<v-list-item-title>Create Shipment</v-list-item-title>
</v-list-item>


<v-list-item to="/shipments/track">
<v-list-item-title>Track Shipment</v-list-item-title>
</v-list-item>


<v-divider />


<v-list-item to="/staff/dashboard">
<v-list-item-title>Staff Dashboard</v-list-item-title>
</v-list-item>


<v-list-item to="/admin/dashboard">
<v-list-item-title>Admin Dashboard</v-list-item-title>
</v-list-item>
</v-list>
</v-navigation-drawer>
</template>


<script setup>
import { ref, watch } from 'vue';


const props = defineProps({ open: Boolean });
const drawer = ref(props.open);
watch(() => props.open, val => drawer.value = val);
</script>
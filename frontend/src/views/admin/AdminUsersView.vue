// File path: /frontend/src/views/admin/AdminUsersView.vue
<template>
<v-container>
<h1>All Users</h1>
<v-data-table :headers="headers" :items="users" item-key="id">
</v-data-table>
</v-container>
</template>


<script setup>
import { ref } from 'vue';


const headers = [
{ text: 'Full Name', value: 'fullName' },
{ text: 'Email', value: 'email' },
{ text: 'Phone', value: 'phone' },
{ text: 'Role', value: 'role' }
];


const users = ref([
{ id: 1, fullName: 'John Doe', email: 'john@example.com', phone: '08012345678', role: 'user' },
{ id: 2, fullName: 'Alice Smith', email: 'alice@example.com', phone: '08087654321', role: 'staff' }
]);
</script>
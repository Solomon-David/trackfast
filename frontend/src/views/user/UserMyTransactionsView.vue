

// File path: /frontend/src/views/user/UserMyTransactionsView.vue
<template>
<v-container>
<h1>My Transactions</h1>
<v-data-table :headers="headers" :items="transactions" item-key="id">
<template #item.amount="{ item }">
{{ item.amount | currency }}
</template>
</v-data-table>
</v-container>
</template>


<script setup>
import { ref } from 'vue';


const headers = [
{ text: 'Transaction ID', value: 'id' },
{ text: 'Date', value: 'date' },
{ text: 'Amount', value: 'amount' },
{ text: 'Status', value: 'status' },
];


const transactions = ref([
{ id: 'TX1234', date: '2025-12-08', amount: 5000, status: 'Completed' },
{ id: 'TX1235', date: '2025-12-07', amount: 2500, status: 'Pending' },
]);
</script>


<script>
// Optional currency filter
import { createApp } from 'vue';
createApp({}).config.globalProperties.$filters = {
currency(value) {
if (!value) return '';
return '₦' + value.toLocaleString();
}
};
</script>
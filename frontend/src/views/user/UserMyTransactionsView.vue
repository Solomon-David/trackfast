// File path: /frontend/src/views/user/UserMyTransactionsView.vue
<template>
  <v-container>
    <h1>My Transactions</h1>
    <v-data-table :headers="headers" :items="transactions" item-key="id">
      <template #item.amount="{ item }">
        {{ useFormatCurrency(item.amount) }}
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useFormatCurrency } from "@/composables/formatCurrency";

const headers = ref([
  { title: "Transaction ID", key: "id" },
  { title: "Date", key: "date" },
  { title: "Amount", key: "amount" },
  { title: "Status", key: "status" },
]);

const transactions = ref([
  { id: "TX1234", date: "2025-12-08", amount: 5000, status: "Completed" },
  { id: "TX1235", date: "2025-12-07", amount: 2500, status: "Pending" },
]);
</script>

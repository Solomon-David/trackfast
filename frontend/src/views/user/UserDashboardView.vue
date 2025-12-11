<template>
  <v-container class="py-10">
    <!-- Welcome Header -->
    <div class="mb-8 text-center">
      <h1 class="text-h4 font-weight-bold">Welcome, {{ userStore.user?.fullName }}</h1>
      <p class="text-subtitle-1 text-grey-darken-1">
        Here’s a quick overview of your activities.
      </p>
    </div>

    <!-- Main Dashboard Cards -->
    <v-row>
      <!-- Shipments -->
      <v-col cols="12" md="6">
        <v-card class="pa-6 elevation-3 hover-card" rounded="lg">
          <div class="d-flex align-center mb-4">
            <v-icon size="32" color="primary">mdi-truck-fast</v-icon>
            <h2 class="text-h6 ml-3">My Shipments</h2>
          </div>

          <p class="text-body-2 mb-4">Track and manage all your shipments easily.</p>

          <v-btn color="primary" variant="flat" @click="$router.push('/user/shipments')">
            View Shipments
          </v-btn>
        </v-card>
      </v-col>

      <!-- Transactions -->
      <v-col cols="12" md="6">
        <v-card class="pa-6 elevation-3 hover-card" rounded="lg">
          <div class="d-flex align-center mb-4">
            <v-icon size="32" color="primary">mdi-receipt-text</v-icon>
            <h2 class="text-h6 ml-3">My Transactions</h2>
          </div>

          <p class="text-body-2 mb-4">Review your payments and account history.</p>

          <v-btn
            color="primary"
            variant="flat"
            @click="$router.push('/user/transactions')"
          >
            View Transactions
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useUserStore } from "@/stores/userStore";
const userStore = useUserStore();
</script>

<style scoped>
.hover-card {
  transition: 0.25s ease;
}
.hover-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.1);
}
</style>

<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    permanent
    :mini-variant.sync="mini"
    class="grey lighten-4"
  >
    <v-list>
      <!-- Dashboard -->
      <v-list-item link to="/user/dashboard" v-if="isLoggedIn">
        <v-icon class="me-3">mdi-view-dashboard</v-icon>
        <v-list-item-title>Dashboard</v-list-item-title>
      </v-list-item>

      <!-- My Shipments -->
      <v-list-item link to="/user/shipments" v-if="isLoggedIn">
        <v-icon class="me-3">mdi-package-variant-closed</v-icon>
        <v-list-item-title>My Shipments</v-list-item-title>
      </v-list-item>

      <!-- My Transactions -->
      <v-list-item link to="/user/transactions" v-if="isLoggedIn">
        <v-icon class="me-3">mdi-cash-multiple</v-icon>
        <v-list-item-title>My Transactions</v-list-item-title>
      </v-list-item>

      <v-divider class="my-2"></v-divider>

      <!-- Staff Section -->
      <template v-if="role === 'staff' || role === 'admin'">
        <v-list-item link to="/staff/dashboard">
          <v-icon class="me-3">mdi-truck-delivery</v-icon>
          <v-list-item-title>Staff Dashboard</v-list-item-title>
        </v-list-item>

        <v-list-item link to="/staff/pickups">
          <v-icon class="me-3">mdi-package-up</v-icon>
          <v-list-item-title>Pickup Requests</v-list-item-title>
        </v-list-item>

        <v-list-item link to="/staff/update-status">
          <v-icon class="me-3">mdi-update</v-icon>
          <v-list-item-title>Update Shipment</v-list-item-title>
        </v-list-item>

        <v-divider class="my-2"></v-divider>
      </template>

      <!-- Admin Section -->
      <template v-if="role === 'admin'">
        <v-list-item link to="/admin/dashboard">
          <v-icon class="me-3">mdi-view-dashboard</v-icon>
          <v-list-item-title>Admin Dashboard</v-list-item-title>
        </v-list-item>

        <v-list-item link to="/admin/users">
          <v-icon class="me-3">mdi-account-multiple</v-icon>
          <v-list-item-title>Users</v-list-item-title>
        </v-list-item>

        <v-list-item link to="/admin/create-staff">
          <v-icon class="me-3">mdi-account-plus</v-icon>
          <v-list-item-title>Create Staff</v-list-item-title>
        </v-list-item>

        <v-list-item link to="/admin/activity">
          <v-icon class="me-3">mdi-timeline-text</v-icon>
          <v-list-item-title>Staff Activity</v-list-item-title>
        </v-list-item>
      </template>

      <v-divider class="my-2"></v-divider>

      <!-- Logout -->
      <v-list-item @click="logout" v-if="isLoggedIn">
        <v-icon class="me-3">mdi-logout</v-icon>
        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
    </v-list>

    <!-- Collapse Toggle -->
    <v-btn icon @click="mini = !mini" class="mt-auto mb-2 ms-2" v-if="isLoggedIn">
      <v-icon>{{ mini ? "mdi-chevron-right" : "mdi-chevron-left" }}</v-icon>
    </v-btn>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";

const mini = ref(false);

const userStore = useUserStore();
const router = useRouter();

// Computed for conditional display
const isLoggedIn = computed(() => userStore.isLoggedIn);
const drawer = ref(isLoggedIn.value);
const role = computed(() => userStore.user?.role || null);

// Logout handler
const logout = () => {
  userStore.logout();
  router.push("/auth/login");
};
</script>

<style scoped>
.v-navigation-drawer {
  width: 250px;
}
</style>

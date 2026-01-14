<template>
  <div>
    <!-- Side Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :permanent="!isMobile"
      app
      class="grey lighten-4"
    >
      <v-list>
        <!-- Dashboard -->
        <v-list-item link to="/" v-if="isLoggedIn">
          <v-icon class="me-3">mdi-home</v-icon>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>

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

        <v-divider class="my-2"></v-divider>

        <!-- Staff Section -->
        <template v-if="role === 'staff' || role === 'admin'">
          <v-list-item link to="/staff/dashboard">
            <v-icon class="me-3">mdi-truck-delivery</v-icon>
            <v-list-item-title>Staff Dashboard</v-list-item-title>
          </v-list-item>

          <v-list-item link to="/staff/shipments">
            <v-icon class="me-3">mdi-package-up</v-icon>
            <v-list-item-title>Shipments</v-list-item-title>
          </v-list-item>

          <v-list-item link to="/staff/create-transaction">
            <v-icon class="me-3">mdi-receipt-text-outline</v-icon>
            <v-list-item-title>Generate Reciept</v-list-item-title>
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

          <v-list-item link to="/admin/pricing-settings">
            <v-icon><v-icon>mdi-cash</v-icon></v-icon>
            <v-list-item-title> Pricing Settings</v-list-item-title>
          </v-list-item>
        </template>

        <v-divider class="my-2"></v-divider>

        <!-- Track Packages -->
        <v-list-item link to="/track/" v-if="isLoggedIn">
          <v-icon class="me-3">mdi-package-up</v-icon>
          <v-list-item-title> Track Package</v-list-item-title>
        </v-list-item>

        <!-- My Profile -->
        <v-list-item link to="/user/profile" v-if="isLoggedIn">
          <v-icon class="me-3">mdi-account</v-icon>
          <v-list-item-title>My Profile</v-list-item-title>
        </v-list-item>

        <!-- Logout -->
        <v-list-item @click="logout" v-if="isLoggedIn">
          <v-icon class="me-3">mdi-logout</v-icon>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>

      <!-- Collapse Toggle Button (Desktop only) -->
      <!-- <v-btn
        v-if="isLoggedIn && !isMobile"
        icon
        @click="mini = !mini"
        class="mt-auto mb-2 ms-2"
      >
        <v-icon>{{ mini ? "mdi-chevron-right" : "mdi-chevron-left" }}</v-icon>
      </v-btn>                   -->
    </v-navigation-drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject, watch } from "vue";
import { useDisplay } from "vuetify";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";

const drawer = inject("drawer");

watch(drawer, (newVal) => {
  console.log("SideMenu Drawer state changed:", newVal);
});

const userStore = useUserStore();
const router = useRouter();
const { mobile } = useDisplay();

// Detect if device is mobile
const isMobile = computed(() => mobile.value);

// User state
const isLoggedIn = computed(() => userStore.isLoggedIn);
const role = computed(() => userStore.user?.role || null);

// When on mobile, drawer should start closed
onMounted(() => {
  if (isMobile.value) drawer.value = false;
});

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

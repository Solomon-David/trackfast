// File path: /frontend/src/views/user/UserProfileView.vue
<template>
  <v-container>
    <h1>User Profile</h1>
    <v-form @submit.prevent="updateProfile">
      <v-text-field v-model="fullName" label="Full Name" />
      <v-text-field v-model="email" label="Email" />
      <v-text-field v-model="phone" label="Phone Number" />
      <v-btn type="submit" color="primary">Update Profile</v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore";
const userStore = useUserStore();

const fullName = ref(userStore.user?.fullName);
const email = ref(userStore.user?.email);
const phone = ref(userStore.user?.phone);

const updateProfile = () => {
  console.log("Profile updated:", { fullName: fullName.value, phone: phone.value });
};
</script>

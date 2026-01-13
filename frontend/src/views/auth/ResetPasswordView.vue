<template>
  <v-container class="fill-height" fluid>
    <v-card class="pa-6 mx-auto w-100" max-width="420">
      <h2 class="text-h5 mb-4">Reset Password</h2>

      <v-form @submit.prevent="handleReset" class="">
        <v-text-field v-model="email" disabled> </v-text-field>
        <v-text-field
          v-model="token"
          label="Enter Verification Code"
          required
        ></v-text-field>
        <v-text-field
          v-model="password"
          label="New Password"
          :type="showPassword ? 'text' : 'password'"
          required
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="showPassword = !showPassword"
        ></v-text-field>
        <v-alert v-show="alertMessage" :type="alertType">{{ alertMessage }}</v-alert>
        <v-btn type="submit" color="primary" :loading="loading">Reset Password</v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore.js";

const route = useRoute();
const router = useRouter();
const email = ref(route.query.email || "");
const token = ref("");
const password = ref("");

const alertMessage = ref("");
const alertType = ref("");
const showPassword = ref(false);
const loading = ref(false);

const handleReset = () => {
  loading.value = true;
  const { resetPassword } = useUserStore();
  resetPassword(email.value, token.value, password.value)
    .then((res) => {
      alertMessage.value = res.message || "Password changed successfully";
      if (res.status) {
        router.push({ path: "/auth/login" });
        alertType.value = "success";
      } else {
        alertType.value = "error";
      }
    })
    .catch((error) => {
      alertMessage.value = error.message || "An error occurred";
      alertType.value = "error";
    })
    .finally(() => {
      loading.value = false;
    });
};
// change from auth to user
</script>

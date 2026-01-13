// ResetPasswordView.vue
<template>
  <v-container class="py-10 mt-auto mb-auto">
    <v-card class="mx-auto pa-6" max-width="420">
      <h2 class="text-h5 mb-4">Update Password</h2>
      <v-form @submit.prevent="handleReset">
        <v-text-field
          v-model="password"
          label="Old Password"
          :type="showPassword ? 'text' : 'password'"
          required
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="showPassword = !showPassword"
        ></v-text-field>
        <div class="d-flex mb-4">
          <a class="text-right text-blue-grey w-100" href="/forgot-password"
            >Forgot Password?</a
          >
        </div>
        <v-text-field
          v-model="newPassword"
          label="New Password"
          :type="showNewPassword ? 'text' : 'password'"
          :append-inner-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="showNewPassword = !showNewPassword"
          required
        ></v-text-field>
        <v-alert v-if="alertMessage" :type="alertType">{{ alertMessage }}</v-alert>
        <v-btn type="submit" block class="mt-4" color="primary">Reset Password</v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup>
import { useUserStore } from "@/stores/userStore.js";
import { ref } from "vue";

const password = ref("");
const newPassword = ref("");
const alertMessage = ref("");
const alertType = ref("");

const showPassword = ref(false);
const showNewPassword = ref(false);

const handleReset = () => {
  const { changePassword } = useUserStore();
  changePassword(password.value, newPassword.value)
    .then(() => {
      alertMessage.value = "Password changed successfully";
      alertType.value = "success";
    })
    .catch((error) => {
      alertMessage.value = error.message || "An error occurred";
      alertType.value = "error";
    });
};
// change from auth to user
</script>

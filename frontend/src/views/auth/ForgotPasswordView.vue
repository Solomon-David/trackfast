// ForgotPasswordView.vue
<template>
  <v-container class="py-10 mt-auto mb-auto">
    <v-card class="mx-auto pa-6" max-width="420">
      <h2 class="text-h5 mb-4">Reset Password</h2>

      <v-form @submit.prevent="handleForgot">
        <v-text-field
          v-model="email"
          label="Enter your email"
          type="email"
          required
        ></v-text-field>
        <v-btn :loading="loader" type="submit" block class="mt-4" color="primary"
          >Send Reset Link</v-btn
        >
      </v-form>
      <v-alert v-if="message != ''" :type="state" class="mt-4">
        {{ message }}
      </v-alert>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";

const requestResetCode = useUserStore().requestResetCode;

const email = ref("");
const state = ref("");
const message = ref("");
const loader = ref(false);
const router = useRouter();

const handleForgot = () => {
  loader.value = true;
  if (!email.value) {
    alert("Please enter your email address.");
    return;
  }
  message.value = "";
  requestResetCode(email.value)
    .then((response) => {
      console.log(response.message, response.success);

      message.value = response.message;
      state.value = response.success ? "success" : "error";

      loader.value = false;

      router.push({ path: "reset-password", query: { email: email.value } });
    })
    .catch((err) => {
      console.error(err);
      loader.value = false;
      message.value = "An error occurred while sending the reset link.";
      state.value = "error";
    });
};
</script>

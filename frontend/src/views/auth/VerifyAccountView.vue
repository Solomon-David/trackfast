<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card width="400" class="d-flex flex-column pa-4">
      <v-card-title class="">Verify Your Account</v-card-title>

      <v-banner-text class="text-center pa-2" variant="info"
        >A verification code has been sent to your email, <b>{{ email }}</b
        >.</v-banner-text
      >
      <v-text-field
        v-model="code"
        label="Verification Code"
        prepend-icon="mdi-shield-key"
      />

      <v-btn block color="primary" class="mt-4" @click="handleVerify">
        Verify Account
      </v-btn>

      <p class="error text-red mt-3">{{ error }}</p>
      <p class="success text-green mt-3">{{ success }}</p>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useRoute, useRouter } from "vue-router";

const email = ref("");
const code = ref("");
const error = ref("");
const success = ref("");

const userStore = useUserStore();
const router = useRouter();

async function handleVerify() {
  error.value = "";
  success.value = "";

  const res = await userStore.verifyAccount(email.value, code.value);

  if (!res.success) {
    error.value = res.message;
  } else {
    success.value = res.message;

    userStore.loginByVerification(res.user, res.token);
    router.push("/user/dashboard");
  }
}

onMounted(() => {
  const route = useRoute();
  email.value = route.query.email;
});
</script>

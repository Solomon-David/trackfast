<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="4">
        <v-card>
          <div class="d-flex flex-column align-center">
            <v-img
              src="/src/assets/logo.png"
              width="80"
              height="80"
              class="rounded-circle mb-4"
            ></v-img>
            <v-card-title class="text-h5">Login</v-card-title>
          </div>
          <v-card-text>
            <v-form ref="form">
              <v-text-field v-model="email" label="Email" required></v-text-field>
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                @keypress.enter="handleLogin"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-btn
            type="submit"
            color="primary"
            block
            :loading="loading"
            @click="handleLogin"
            >Login</v-btn
          >
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  try {
    await userStore.login({ email: email.value, password: password.value });
    router.push("/user/dashboard");
  } catch (err) {
    console.error(err);
    alert("Login failed: " + err.response?.data?.message || err.message);
  } finally {
    loading.value = false;
  }
};
</script>

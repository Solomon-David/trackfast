<template>
  <v-container>
    <h1 class="text-center mb-2">Contact Us</h1>
    <p class="text-body-1 text-center mb-4">We would love to hear from you</p>
    <v-form @submit.prevent="submitContact">
      <template v-if="isLoggedIn">
        <p class="text-h6">Name: {{ name }}</p>
        <p class="text-h6">Email: {{ email }}</p>
      </template>
      <template v-else>
        <v-text-field v-model="name" label="Name" required />
        <v-text-field v-model="email" label="Email" required />
      </template>
      <v-textarea v-model="message" label="Message" required />
      <v-btn :loading="loading" type="submit" color="primary">Send Message</v-btn>
    </v-form>
    <v-alert :type="status ? 'success' : 'error'" v-if="show">
      {{ status ? "Sent! Thank you for your feedback!" : "Sorry, an error occured!" }}
    </v-alert>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore";

const { contactUs, isLoggedIn, user } = useUserStore();

const name = ref(isLoggedIn ? user?.fullName : "");
const email = ref(isLoggedIn ? user?.email : "");
const message = ref("");

const status = ref("");
const show = ref(false);
const loading = ref(false);

const submitContact = async () => {
  loading.value = true;
  show.value = false;
  status.value = await contactUs(name.value, email.value, message.value);

  name.value = isLoggedIn ? user?.fullName : "";
  email.value = isLoggedIn ? user?.email : "";
  show.value = true;
  loading.value = false;
};
</script>

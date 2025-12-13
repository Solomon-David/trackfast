// File path: /frontend/src/views/ContactView.vue
<template>
  <v-container>
    <h1 class="text-center mb-2">Contact Us</h1>
    <p class="text-body-1 text-center mb-4">We would love to hear from you</p>
    <v-form @submit.prevent="submitContact">
      <v-text-field v-model="name" label="Name" required />
      <v-text-field v-model="email" label="Email" required />
      <v-textarea v-model="message" label="Message" required />
      <v-btn type="submit" color="primary">Send Message</v-btn>
    </v-form>
    <v-alert type="success" v-if="status">
        Message sent!
    </v-alert>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import axiosInstance from '@/utils/axiosInstance.js';

const name = ref("");
const email = ref("");
const message = ref("");
const status = ref(false);

const submitContact = async () => {
  console.log("Contact message:", {
    name: name.value,
    email: email.value,
    message: message.value,
  });

  status.value = await axiosInstance.post("/users/contact", {fullName: name.value, email:email.value, message: message.value});
};


</script>

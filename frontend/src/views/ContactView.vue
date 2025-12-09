

// File path: /frontend/src/views/ContactView.vue
<template>
<v-container>
<h1>Contact Us</h1>
<v-form @submit.prevent="submitContact">
<v-text-field v-model="name" label="Name" required />
<v-text-field v-model="email" label="Email" required />
<v-textarea v-model="message" label="Message" required />
<v-btn type="submit" color="primary">Send Message</v-btn>
</v-form>
</v-container>
</template>


<script setup>
import { ref } from 'vue';
const name = ref('');
const email = ref('');
const message = ref('');


const submitContact = () => {
console.log('Contact message:', { name: name.value, email: email.value, message: message.value });
};
</script>
// ForgotPasswordView.vue
<template>
<v-container class="py-10">
<v-card class="mx-auto pa-6" max-width="420">
<h2 class="text-h5 mb-4">Reset Password</h2>


<v-form @submit.prevent="handleForgot">
<v-text-field v-model="email" label="Enter your email" type="email" required></v-text-field>
<v-btn type="submit" block class="mt-4" color="primary">Send Reset Link</v-btn>
</v-form>
</v-card>
</v-container>
</template>


<script setup>
import { ref } from 'vue'


const email = ref('')


const handleForgot = () => {
console.log("Sending reset email to:", email.value)
}
</script>
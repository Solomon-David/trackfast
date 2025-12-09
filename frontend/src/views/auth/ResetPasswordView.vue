

// ResetPasswordView.vue
<template>
<v-container class="py-10">
<v-card class="mx-auto pa-6" max-width="420">
<h2 class="text-h5 mb-4">Create New Password</h2>


<v-form @submit.prevent="handleReset">
<v-text-field v-model="password" label="New Password" type="password" required></v-text-field>
<v-text-field v-model="confirmPassword" label="Confirm Password" type="password" required></v-text-field>
<v-btn type="submit" block class="mt-4" color="primary">Reset Password</v-btn>
</v-form>
</v-card>
</v-container>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'


const router = useRouter()
const password = ref('')
const confirmPassword = ref('')


const handleReset = () => {
if (password.value !== confirmPassword.value) {
alert("Passwords do not match")
return
}
console.log("Password reset successful")
router.push('/login')
}
</script>
// File path: /frontend/src/views/admin/AdminCreateStaffView.vue
<template>
<v-container>
<h1>Create Staff</h1>
<v-form @submit.prevent="createStaff">
<v-text-field v-model="fullName" label="Full Name" required />
<v-text-field v-model="email" label="Email" required />
<v-text-field v-model="phone" label="Phone" required />
<v-select v-model="role" :items="roles" label="Role" required />
<v-text-field v-model="password" label="Password" type="password" required />
<v-btn type="submit" color="primary">Create Staff</v-btn>
</v-form>
</v-container>
</template>


<script setup>
import { ref } from 'vue';
const fullName = ref('');
const email = ref('');
const phone = ref('');
const role = ref('staff');
const password = ref('');
const roles = ['staff', 'admin'];


const createStaff = () => {
console.log('Create staff:', { fullName: fullName.value, email: email.value, phone: phone.value, role: role.value });
};
</script>
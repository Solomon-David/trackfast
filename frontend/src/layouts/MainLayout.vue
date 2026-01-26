// File path: /frontend/src/layouts/MainLayout.vue
<template>
<v-app>
<Navbar @toggle-drawer="drawer = !drawer"  />

<SideMenu :open="isLoggedIn && drawer" />


<v-main>
<v-container class="py-5">
<router-view />
</v-container>
</v-main>


<Footer />
</v-app>
</template>


<script setup>
import { ref } from 'vue';
import Navbar from '@/components/shared/Navbar.vue';
import SideMenu from '@/components/shared/SideMenu.vue';
import Footer from '@/components/shared/Footer.vue';
import {useUserStore} from '@/stores/userStore';

const isLoggedIn = useUserStore().isLoggedIn;

const drawer = ref(false);
</script>
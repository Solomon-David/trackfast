<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const trackingNumber = ref("");

const trackNow = () => {
  if (!trackingNumber.value.trim()) return;
  router.push(`/track/${trackingNumber.value}`);
};
</script>

<template>
  <v-container fluid class="pa-0">

    <!-- HERO BANNER -->
    <section class="hero-section d-flex flex-column justify-center align-center text-center">
      <h1 class="text-h3 font-weight-bold mb-4">Welcome to Track Fast Logistics</h1>

      <p class="text-subtitle-1 mb-6">
        Your trusted partner for fast, secure, and reliable nationwide deliveries.
      </p>

      <!-- Tracking Input -->
      <v-card class="pa-4 hero-card" width="420" elevation="6">
        <v-text-field
          v-model="trackingNumber"
          label="Track a Package"
          placeholder="Enter Tracking Number"
          variant="outlined"
          clearable
        />

        <v-btn
          block
          color="primary"
          size="large"
          class="mt-3"
          @click="trackNow"
        >
          Track Now
        </v-btn>
      </v-card>

      <!-- CTA BUTTONS -->
      <div class="mt-8 d-flex ga-4">
        <v-btn color="primary" variant="flat" to="/register">Create Account</v-btn>
        <v-btn color="secondary" variant="outlined" to="/login">Login</v-btn>
      </div>
    </section>

    <!-- FEATURES SECTION -->
    <section class="mt-16 mb-16">
      <v-container>
        <h2 class="text-h4 font-weight-bold text-center mb-10">Why Choose Track Fast?</h2>

        <v-row>
          <v-col cols="12" md="4">
            <v-card class="pa-5" elevation="2">
              <h3 class="text-h6 font-weight-bold mb-2">Real-Time Tracking</h3>
              <p>Follow your shipment every step of the way with instant updates.</p>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="pa-5" elevation="2">
              <h3 class="text-h6 font-weight-bold mb-2">Fast Delivery</h3>
              <p>Nationwide delivery with optimized routes for speed and efficiency.</p>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="pa-5" elevation="2">
              <h3 class="text-h6 font-weight-bold mb-2">Secure & Reliable</h3>
              <p>Every package is handled with care and monitored securely.</p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

  </v-container>
</template>

<style scoped>
.hero-section {
  background: linear-gradient(
      rgba(0, 0, 0, 0.45),
      rgba(0, 0, 0, 0.45)
    ),
    url('https://images.unsplash.com/photo-1586528116508-1a67d1d9634a?auto=format&fit=crop&w=1500&q=80');
  background-size: cover;
  background-position: center;
  padding: 140px 20px;
  color: white;
}

.hero-card {
  backdrop-filter: blur(6px);
  background: rgba(255, 255, 255, 0.2);
}
</style>

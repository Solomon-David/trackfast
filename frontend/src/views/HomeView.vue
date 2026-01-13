<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import AboutView from "@/views/AboutView.vue";
import ContactView from "@/views/ContactView.vue";

const router = useRouter();
const trackingNumber = ref("");

const trackNow = () => {
  if (!trackingNumber.value.trim()) return;
  router.push(`/track/${trackingNumber.value}`);
};

const ctaMode = ref("track");
import { useShipmentCalculator } from "@/composables/useShipmentCalculator";

const loading = ref(false);

// Cities
const fromCity = ref("");
const destinationCity = ref("");
const sameCity = ref(false);

// Dimensional fields
const length = ref("");
const width = ref("");
const height = ref("");

// Weight
const weight = ref("");

// Result
const estimatedCost = ref(null);

// Auto-calculated volume
const volume = computed(() => {
  const L = Number(length.value) || 0;
  const W = Number(width.value) || 0;
  const H = Number(height.value) || 0;
  return L * W * H;
});

// Use the composable
const {
  calculatedCost,
  calculateCost: composableCalculateCost,
} = useShipmentCalculator();

// Calculate cost
async function calculateCost() {
  if (!sameCity.value && (!fromCity.value || !destinationCity.value)) {
    estimatedCost.value = "Missing city fields";
    return;
  }

  loading.value = true;

  try {
    const cost = await composableCalculateCost({
      length: Number(length.value),
      width: Number(width.value),
      height: Number(height.value),
      weight: Number(weight.value),
      senderCity: fromCity.value,
      receiverCity: sameCity.value ? fromCity.value : destinationCity.value,
    });

    estimatedCost.value = cost;
  } catch (err) {
    console.error("Error calculating shipment cost:", err);
    estimatedCost.value = "Error calculating cost";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-container fluid class="pa-0 bg-logo">
    <!-- HERO BANNER -->
    <section
      class="hero-section d-flex flex-column justify-center align-center text-center"
    >
      <h1 class="text-h3 font-weight-bold mb-4">Welcome to TrackFast Logistics</h1>

      <p class="text-subtitle-1 mb-6">
        Your trusted partner for fast, secure, and reliable nationwide deliveries.
      </p>

      <!-- CTA CARD -->
      <v-card class="pa-4" width="420" elevation="6">
        <!-- TRACKING MODE -->
        <template v-if="ctaMode === 'track'">
          <v-text-field
            v-model="trackingNumber"
            label="Track a Package"
            placeholder="Enter Tracking Number"
            variant="outlined"
            @keyup.enter="trackNow"
            clearable
          />

          <v-btn block color="primary" size="large" class="mt-3" @click="trackNow">
            Track Now
          </v-btn>
        </template>

        <!-- CALCULATOR MODE -->
        <template v-else>
          <!-- Shipping Calculator -->
          <h3 class="text-h6 font-weight-bold mb-4">Shipment Cost Calculator</h3>

          <!-- From City -->
          <v-text-field
            v-model="fromCity"
            label="From (City)"
            variant="outlined"
            clearable
          />

          <!-- Same City Checkbox -->
          <v-checkbox
            v-model="sameCity"
            label="Same City Delivery"
            class="mt-n3"
          ></v-checkbox>

          <!-- Destination City -->
          <v-text-field
            v-model="destinationCity"
            label="Destination (City)"
            variant="outlined"
            clearable
            :disabled="sameCity"
          />
          <span> Package Dimensions</span>
          <!-- Dimensional Fields -->
          <div class="d-flex ga-3 mt-3">
            <v-text-field
              v-model="length"
              label="Length (cm)"
              type="number"
              variant="outlined"
            />
            <v-text-field
              v-model="width"
              label="Width (cm)"
              type="number"
              variant="outlined"
            />
            <v-text-field
              v-model="height"
              label="Height (cm)"
              type="number"
              variant="outlined"
            />
          </div>

          <!-- Weight -->
          <v-text-field
            v-model="weight"
            label="Weight (kg)"
            variant="outlined"
            type="number"
          />
          <!-- Calculate -->
          <v-btn
            block
            color="primary"
            class="mt-3"
            :loading="loading"
            @click="calculateCost"
          >
            Calculate Cost
          </v-btn>

          <!-- Result -->
          <div v-if="estimatedCost" class="mt-4 text-center">
            <h3 class="text-h6 font-weight-bold">Estimated Cost:</h3>
            <p class="text-h6 mt-1">${{ estimatedCost }}</p>
          </div>
        </template>
      </v-card>

      <!-- CTA Mode Toggle -->
      <v-btn-toggle v-model="ctaMode" mandatory class="mt-8" divided color="primary">
        <v-btn value="track">Track Package</v-btn>
        <v-btn value="calculate">Calculate Shipping</v-btn>
      </v-btn-toggle>
    </section>

    <!-- FEATURES SECTION -->
    <section class="mt-16 mb-16">
      <v-container>
        <h2 class="text-h4 font-weight-bold text-center mb-10">Why Choose Track Fast?</h2>

        <v-row class="my-10">
          <v-col cols="12">
            <v-carousel
              :interval="4000"
              cycle
              height="100%"
              show-arrows="hover"
              hide-delimiters="false"
              class="rounded-xl mb-4"
            >
              <!-- --- Real-Time Tracking --- -->
              <v-carousel-item>
                <v-card class="pa-6 fade-in-section mx-auto" elevation="3">
                  <h3 class="text-h4 font-weight-bold mb-4 text-center">
                    Real-Time Tracking
                  </h3>

                  <v-img
                    src="/src/assets/realtimetracking.jpg"
                    cover
                    class="rounded-xl mb-6 fade-in-image mx-auto"
                  />

                  <p class="text-body-1 px-4">
                    Follow your shipment every step of the way with instant updates
                    powered by advanced GPS and monitoring systems. Track your parcels
                    across multiple checkpoints to ensure full transparency from pickup to
                    delivery. With real-time notifications, you stay in control throughout
                    the entire journey.
                  </p>
                </v-card>
              </v-carousel-item>

              <!-- --- Fast Delivery --- -->
              <v-carousel-item>
                <v-card
                  class="pa-6 fade-in-section mx-auto"
                  elevation="3"
                  max-width="95%"
                >
                  <h3 class="text-h4 font-weight-bold mb-4 text-center">Fast Delivery</h3>

                  <v-img
                    src="/src/assets/fastdelivery.jpg"
                    cover
                    class="rounded-xl mb-6 fade-in-image mx-auto"
                  />

                  <p class="text-body-1 px-4">
                    Our optimized delivery routes ensure your packages arrive quickly and
                    safely. Powered by smart logistics planning and real-time traffic
                    evaluation, our delivery system minimizes delays and maximizes
                    efficiency. Whether across town or nationwide, TrackFast delivers with
                    speed you can trust.
                  </p>
                </v-card>
              </v-carousel-item>

              <!-- --- Secure & Reliable --- -->
              <v-carousel-item>
                <v-card
                  class="pa-6 fade-in-section mx-auto"
                  elevation="3"
                  max-width="95%"
                >
                  <h3 class="text-h4 font-weight-bold mb-4 text-center">
                    Secure & Reliable
                  </h3>

                  <v-img
                    src="/src/assets/secureandreliable.jpg"
                    cover
                    class="rounded-xl mb-6 fade-in-image mx-auto"
                  />

                  <p class="text-body-1 px-4">
                    Every package is handled with strict security protocols and monitored
                    through each stage of the process. From warehouse storage to delivery
                    hand-off, TrackFast ensures that your items are protected and
                    transported with care. Reliability and security are built into every
                    shipment.
                  </p>
                </v-card>
              </v-carousel-item>
            </v-carousel>
          </v-col>
        </v-row>
      </v-container>
    </section>
    <AboutView />
    <ContactView />
  </v-container>
</template>

<style scoped>
.bg-logo {
}

.hero-section {
  background: linear-gradient(rgba(48, 48, 48, 0.6), rgba(48, 48, 48, 0.6)),
    url("./../assets/logo-noname.png");
  background-size: cover;
  background-position: center;
  padding: 140px 20px;
  color: white;
}

.hero-card {
  backdrop-filter: blur(6px);
  background: rgba(255, 255, 255, 0.2);
}

.v-img {
  width: 50vw;
  aspect-ratio: 4/3;
}

.v-card:has(.v-img) {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.v-img + p {
  text-align: center;
  width: 75%;
}

.v-img + p:first-letter {
  font-weight: bold;
}

.v-carousel__controls {
  bottom: 15px !important;
}

.v-carousel__controls__item {
  width: 12px !important;
  height: 12px !important;
}
</style>

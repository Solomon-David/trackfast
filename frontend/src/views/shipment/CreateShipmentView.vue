<template>
  <v-container>
    <h1>Create Shipment</h1>

    <v-form @submit.prevent="submitShipment">
      <v-text-field v-model="senderName" label="Sender Name" required />

      <v-text-field v-model="senderEmail" label="Sender Email" type="email" required />

      <v-text-field v-model="receiverName" label="Receiver Name" required />

      <v-text-field
        v-model="receiverEmail"
        label="Receiver Email"
        type="email"
        required
      />

      <!-- Cities -->
      <v-row>
        <v-col cols="6">
          <v-text-field v-model="fromCity" label="From City" required />
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="toCity" label="To City" required :disabled="sameCity" />
        </v-col>
      </v-row>

      <v-checkbox v-model="sameCity" label="Same City Delivery" />

      <!-- Package -->

      <!-- Package Description -->
      <v-textarea
        v-model="packageDescription"
        label="Package Description"
        auto-grow
        rows="2"
        class="mb-4"
      />
      <v-row>
        <v-col cols="4">
          <v-text-field v-model="length" label="Length (cm)" type="number" required />
        </v-col>
        <v-col cols="4">
          <v-text-field v-model="width" label="Width (cm)" type="number" required />
        </v-col>
        <v-col cols="4">
          <v-text-field v-model="height" label="Height (cm)" type="number" required />
        </v-col>
      </v-row>

      <v-text-field v-model="weight" label="Weight (kg)" type="number" required />

      <!-- Insurance -->
      <v-checkbox v-model="insuranceSelected" label="Add Insurance" />

      <!-- COST PREVIEW -->
      <v-card class="pa-4 mt-4" v-if="cost">
        <h2 class="text-h5">Estimated Cost</h2>
        <h1 class="text-h4 font-weight-bold">${{ cost.toLocaleString() }}</h1>
        <v-btn class="mt-2" variant="tonal" @click="showBreakdown = true"
          >View Breakdown</v-btn
        >
      </v-card>

      <!-- CONFIRMATION MODAL -->
      <v-dialog v-model="confirmPrice" max-width="500">
        <v-card class="pa-4">
          <h2 class="text-h6 mb-2">Confirm Shipping Price</h2>
          <p>Please review the shipping cost below:</p>
          <v-divider class="my-2" />
          <div class="mb-1">
            <p class="mt-2"><b>Same region delivery fee:</b> ${{ base }}</p>
            <p class="mt-2">
              <b>Product Dimensions:</b> ({{ length }}cm x {{ width }}cm x {{ height }}cm)
              = ${{ (length * width * height) / pricing.volumetricDivisor }}
            </p>
            <p class="mt-2">
              <b>Weight:</b> {{ weight }}kg = ${{ weight * pricing.pricePerKg }}
            </p>
            <p class="mt-2">
              <b>Add package insurance?</b> {{ insuranceSelected ? "yes" : "no" }}.
            </p>
            <p class="mt-2" v-if="insuranceSelected">
              <b>Insurance fee</b>: ${{ pricing.insuranceFee }}
            </p>
          </div>
          <v-divider class="my-2" />
          <h1 class="text-h5 font-weight-bold mb-4">${{ cost }}</h1>

          <v-btn block color="primary" class="mb-2" @click="confirmAndSubmit"
            >Accept & Create Shipment</v-btn
          >
          <v-btn block variant="tonal" @click="confirmPrice = false">Cancel</v-btn>
        </v-card>
      </v-dialog>

      <v-btn
        color="primary"
        class="mt-4"
        :loading="loading"
        @click="openPriceConfirmation"
      >
        Get Cost
      </v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref, watch, onMounted, h } from "vue";
import { useRouter } from "vue-router";
import { useShipmentCalculator } from "@/composables/useShipmentCalculator";
import { useShipmentStore } from "@/stores/shipmentStore";
import { useUserStore } from "@/stores/userStore";
import { usePricingSettingsStore } from "@/stores/pricingSettingsStore";

const router = useRouter();
const shipmentStore = useShipmentStore();
const userStore = useUserStore();
const pricing = ref(null);
const base = ref(0);

onMounted(async () => {
  await usePricingSettingsStore().fetchSettings();
  pricing.value = usePricingSettingsStore().settings;
  base.value = sameCity.value ? pricing.value.basePrice / 3 : pricing.value.basePrice;

  if (userStore.user) {
    senderName.value = userStore.user.fullName || "";
    senderEmail.value = userStore.user.email || "";
  }
});

const loading = ref(false);

// Form fields
const senderName = ref("");
const senderEmail = ref("");
const receiverName = ref("John Doe");
const receiverEmail = ref("sakesobia@gmail.com");

const fromCity = ref("New York");
const toCity = ref("Nevada");
const sameCity = ref(false);

const length = ref(20);
const width = ref(30);
const height = ref(10);
const weight = ref(5);

const packageDescription = ref("Food");

const insuranceSelected = ref(true);

const showBreakdown = ref(false);
const breakdown = ref({});
const cost = ref();

// Auto recalc cost whenever inputs change
watch(
  [length, width, height, weight, fromCity, toCity, sameCity, insuranceSelected],
  async () => {
    if (!length.value || !width.value || !height.value || !weight.value) return;

    const result = pricing.value.calculateCost(
      base.value,
      length.value,
      width.value,
      height.value,
      weight.value,
      insurance.value
    );

    cost.value = result;
    breakdown.value = result.breakdown;
  }
);

watch(showBreakdown, async (newVal) => {
  await usePricingSettingsStore().fetchSettings();
  pricing.value = usePricingSettingsStore().settings;
});

watch(sameCity, () => {
  base.value = sameCity.value
    ? pricing.value.basePrice.toFixed(1) / 3
    : pricing.value.basePrice;
});

// Submit shipment
async function submitShipment() {
  loading.value = true;

  try {
    const payload = {
      sender: { name: userStore?.user?.fullName, email: userStore?.user?.email },
      receiver: { name: receiverName.value, email: receiverEmail.value },
      fromCity: fromCity.value,
      toCity: sameCity.value ? fromCity.value : toCity.value,
      package: {
        length: Number(length.value),
        width: Number(width.value),
        height: Number(height.value),
        weight: Number(weight.value),
        description: packageDescription.value,
      },
      insurance: insuranceSelected.value,
      cost: cost.value,
    };

    const shipment = await shipmentStore.createShipment(payload);

    if (shipment) {
      router.push(`/staff/shipments/${shipment.id}`);
    }
  } catch (error) {
    console.error("Create shipment failed:", error);
  } finally {
    loading.value = false;
  }
}
const confirmPrice = ref(false);

function openPriceConfirmation() {
  confirmPrice.value = true;
}

async function confirmAndSubmit() {
  confirmPrice.value = false;
  await submitShipment();
}
</script>

<style scoped>
.pa-4 {
  padding: 16px !important;
}
</style>

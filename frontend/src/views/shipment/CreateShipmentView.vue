<template>
  <v-container>
    <h1>Create Shipment</h1>

    <v-form @submit.prevent="submitShipment">
      <v-text-field v-model="senderName" label="Sender's Name" required disabled />

      <v-text-field
        v-model="senderEmail"
        label="Sender's Email"
        type="email"
        required
        disabled
      />

      <v-row>
        <v-col cols="7">
          <v-text-field v-model="senderAddress" label="Sender's Address" required />
        </v-col>
        <v-col cols="5">
          <v-text-field
            v-model="senderCity"
            label="Sender's City"
            required
            :disabled="sameCity"
          />
        </v-col>
      </v-row>

      <v-text-field v-model="receiverName" label="Receiver's Name" required />

      <v-text-field
        v-model="receiverEmail"
        label="Receiver's Email"
        type="email"
        required
      />

      <!-- Cities -->
      <v-row>
        <v-col cols="7">
          <v-text-field v-model="receiverAddress" label="Receiver's Address" required />
        </v-col>
        <v-col cols="5">
          <v-text-field
            v-model="receiverCity"
            label="Receiver's City"
            required
            :disabled="sameCity"
          />
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
        class="mt-4 mb-4"
        :loading="loading"
        @click="openPriceConfirmation"
      >
        Get Cost
      </v-btn>
      <v-alert v-if="sendStatus == 'success'" type="success">
        Success! Please make your payment. Your trackingNumber is
        <b>{{ shipment.shipment.trackingNumber }}</b
        >.
        <v-icon @click="copyTrackingNumber">{{ copyText }}</v-icon>
      </v-alert>

      <v-alert v-else-if="sendStatus == 'error'" type="error">
        Sorry. An error occurred!
      </v-alert>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref, watch, onMounted, h } from "vue";
import { useRouter } from "vue-router";
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
const senderAddress = ref("");
const receiverName = ref("");
const receiverEmail = ref("");
const receiverAddress = ref("");
const senderCity = ref("");
const sameCity = ref(false);
const receiverCity = ref("");

const length = ref(20);
const width = ref(30);
const height = ref(10);
const weight = ref(5);
const confirmPrice = ref(false);
const cost = ref(0);

const packageDescription = ref("");
const insuranceSelected = ref(true);

const sendStatus = ref("");
const shipment = ref(null);

const copyText = ref("mdi-clipboard-outline");

// Auto recalc cost whenever inputs change

watch(confirmPrice, async (newVal) => {
  await usePricingSettingsStore().fetchSettings();
  pricing.value = usePricingSettingsStore().settings;
  if (!length.value || !width.value || !height.value || !weight.value) return;

  const result = usePricingSettingsStore().calculateCost(
    base.value,
    length.value,
    width.value,
    height.value,
    weight.value,
    insuranceSelected.value
  );

  cost.value = Number(result).toFixed(2);
});

watch(sameCity, () => {
  base.value = sameCity.value
    ? (pricing.value.basePrice / 3).toFixed(2)
    : pricing.value.basePrice;
});

// Submit shipment
async function submitShipment() {
  loading.value = true;

  try {
    const payload = {
      sender: {
        name: userStore?.user?.fullName,
        email: userStore?.user?.email,
        address: senderAddress.value,
      },
      receiver: {
        name: receiverName.value,
        email: receiverEmail.value,
        address: receiverAddress.value,
      },
      package: {
        dimensions: {
          length: Number(length.value),
          width: Number(width.value),
          height: Number(height.value),
        },
        weight: Number(weight.value),
        senderCity: senderCity.value,
        receiverCity: receiverCity.value,
        description: packageDescription.value,
      },
      insurance: insuranceSelected.value,
      cost: cost.value,
    };

    shipment.value = await shipmentStore.createShipment(payload);

    if (shipment) {
      sendStatus.value = "success";
      clearInput();
    }
  } catch (error) {
    sendStatus.value = "error";
    console.error("Create shipment failed:", error);
  } finally {
    loading.value = false;
  }
}

function openPriceConfirmation() {
  confirmPrice.value = true;
}

async function confirmAndSubmit() {
  confirmPrice.value = false;
  loading.value = true;
  await submitShipment();
  loading.value = false;
}

function copyTrackingNumber() {
  navigator.clipboard.writeText(shipment.value.shipment.trackingNumber);
  copyText.value = "mdi-clipboard-check-outline";
  setTimeout(() => {
    copyText.value = "mdi-clipboard-outline";
  }, 2000);
}

function clearInput() {
  senderAddress.value = "";
  receiverName.value = "";
  receiverEmail.value = "";
  receiverAddress.value = "";
  senderCity.value = "";
  receiverCity.value = "";
  length.value = null;
  width.value = null;
  height.value = null;
  weight.value = null;
  packageDescription.value = "";
  insuranceSelected.value = false;
}

//watchers
watch(sameCity, () => {
  receiverCity.value = sameCity.value ? senderCity.value : receiverCity.value;
});
</script>

<style scoped>
.pa-4 {
  padding: 16px !important;
}
</style>

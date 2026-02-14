<template>
  <v-container>
    <h1>Create Shipment</h1>

    <v-form @submit.prevent="submitShipment">
      <v-text-field v-model="senderName" label="Sender's Name" required readonly />

      <v-text-field
        v-model="senderEmail"
        label="Sender's Email"
        type="email"
        required
        readonly
      />

      <v-row>
        <v-col>
          <v-text-field v-model="senderAddress" label="Sender's Address" required />
        </v-col>

        <v-col cols="max-width">
          <v-text-field
            v-model="senderCity"
            label="Sender's City"
            @blur="
              () => {
                senderCountry = '';
              }
            "
            required
            :disabled="sameCity"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="senderCountry"
            label="Sender's Country"
            required
            @update:focused="
              () => {
                senderCountryLoading = false;
                senderCountryState = 'empty';
              }
            "
            :loading="senderCountryLoading"
            :append-inner-icon="
              senderCountryState == 'resolved'
                ? 'mdi-check'
                : senderCountryState == 'error'
                ? 'mdi-alert'
                : null
            "
            :icon-color="
              senderCountryState == 'resolved'
                ? 'green'
                : senderCountryState == 'error'
                ? 'red'
                : null
            "
            @blur="getSenderLocation"
          />
        </v-col>
      </v-row>

      <v-text-field
        v-model="receiverName"
        label="Receiver's Name"
        required
        validate-on-blur
      />

      <v-text-field
        v-model="receiverEmail"
        label="Receiver's Email"
        type="email"
        :rules="[rules.required, rules.isEmail]"
        validate-on-blur
        required
      />

      <!-- Cities -->
      <v-row>
        <v-col>
          <v-text-field v-model="receiverAddress" label="Receiver's Address" required />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="receiverCity"
            label="Receiver's City"
            @blur="
              () => {
                receiverCountry = '';
              }
            "
            required
            :disabled="sameCity"
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="receiverCountry"
            label="Receiver's Country"
            required
            @update:focused="
              () => {
                receiverCountryLoading = false;
                receiverCountryState = 'empty';
              }
            "
            :loading="receiverCountryLoading"
            :append-inner-icon="
              receiverCountryState == 'resolved'
                ? 'mdi-check'
                : receiverCountryState == 'error'
                ? 'mdi-alert'
                : null
            "
            :icon-color="
              receiverCountryState == 'resolved'
                ? 'green'
                : receiverCountryState == 'error'
                ? 'red'
                : null
            "
            @blur="getReceiverLocation"
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

          <v-btn
            block
            color="primary"
            class="mb-2"
            @click="submitShipment"
            :loading="shipmentLoading"
            >Accept & Create Shipment</v-btn
          >
          <v-btn block variant="tonal" @click="confirmPrice = false">Cancel</v-btn>
        </v-card>
      </v-dialog>

      <v-btn color="primary" class="mt-4 mb-4" @click="openPriceConfirmation">
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
import { ref, watch, onMounted } from "vue";
import { useShipmentCalculator } from "@/composables/useShipmentCalculator.js";
import { useShipmentStore } from "@/stores/shipmentStore.js";
import { useUserStore } from "@/stores/userStore";
import { usePricingSettingsStore } from "@/stores/pricingSettingsStore";
import { getAddress } from "@/utils/radarInstance.js";
import rules from "@/utils/formRules.js";

const calculateCost = useShipmentCalculator().calculateCost;
const shipmentStore = useShipmentStore();
const userStore = useUserStore();
const pricing = ref(null);
const base = ref(0);

const loading = ref(false);
const shipmentLoading = ref(false);
const dialogLoader = ref(false);

// Form fields
const senderName = ref(userStore?.user?.fullName || "");
const senderEmail = ref(userStore?.user?.email || "");
const senderAddress = ref("");
const receiverName = ref("");
const receiverEmail = ref("");
const receiverAddress = ref("");
const senderCity = ref("");
const receiverCity = ref("");
const senderCountry = ref("");
const receiverCountry = ref("");
const sameCity = ref(false);

const senderLocation = ref("");
const receiverLocation = ref("");

const length = ref();
const width = ref();
const height = ref();
const weight = ref();
const confirmPrice = ref(false);
const cost = ref(0);

const packageDescription = ref("");
const insuranceSelected = ref(true);

const sendStatus = ref("");
const shipment = ref(null);

const receiverCountryLoading = ref(false);
const senderCountryLoading = ref(false);

const receiverCountryState = ref("empty");
const senderCountryState = ref("empty");

const copyText = ref("mdi-clipboard-outline");

// Setting the receive location to match sender location if "Same City" is selected.
receiverCity.value = sameCity.value ? senderCity.value : receiverCity.value;
receiverCountry.value = sameCity.value ? senderCountry.value : receiverCountry.value;

// Fetching sender location
async function getSenderLocation() {
  try {
    if (senderCity.value && senderCountry.value) {
      senderCountryLoading.value = true;
      senderLocation.value = await getAddress(senderCity.value, senderCountry.value);
      senderCountryState.value = "resolved";
      console.log("Sender Address: ", `${senderCity.value}, ${senderCountry.value}`);
    }
  } catch (error) {
    senderCountryState.value = "error";
    console.error(`Country fetch error: ${error}`);
  } finally {
    senderCountryLoading.value = false;
  }
}

// Fetching receiver address
async function getReceiverLocation() {
  try {
    if (receiverCity.value && receiverCountry.value) {
      receiverCountryLoading.value = true;
      receiverLocation.value = await getAddress(
        receiverCity.value,
        receiverCountry.value
      );
      receiverCountryState.value = "resolved";
      console.log(
        "Receiver Address: ",
        `${receiverCity.value}, ${receiverCountry.value}`
      );
    }
  } catch (error) {
    receiverCountryState.value = "error";
    console.error(`Country fetch error: ${error}`);
  } finally {
    receiverCountryLoading.value = false;
  }
}

// Auto recalc cost whenever inputs change

watch(dialogLoader, async (newVal) => {
  if (dialogLoader.value) {
    await usePricingSettingsStore().fetchSettings();
    pricing.value = usePricingSettingsStore().settings;
    if (!length.value || !width.value || !height.value || !weight.value) return;

    cost.value = await calculateCost({
      length: length.value,
      width: width.value,
      height: height.value,
      weight: weight.value,
      withInsurance: insuranceSelected,
      senderAddress: senderLocation.value,
      receiverAddress: receiverLocation.value,
    });

    confirmPrice.value = true;
    dialogLoader.value = false;
  }
});

watch(sameCity, () => {
  base.value = sameCity.value
    ? (pricing.value.basePrice / 3).toFixed(2)
    : pricing.value.basePrice;
});

// Submit shipment
async function submitShipment() {
  shipmentLoading.value = true;
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
        senderAddress: senderAddress.value,
        receiverAddress: receiverAddress.value,
        senderCity: senderCity.value,
        receiverCity: receiverCity.value,
        senderCountry: senderCountry.value,
        receiverCountry: receiverCountry.value,
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
    confirmPrice.value = false;
    shipmentLoading.value = false;
    loading.value = false;
  }
}

function openPriceConfirmation() {
  dialogLoader.value = true;
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
  senderCountry.value = "";
  receiverCountry.value = "";
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

onMounted(async () => {
  await usePricingSettingsStore().fetchSettings();
  pricing.value = usePricingSettingsStore().settings;
  base.value = sameCity.value ? pricing.value.basePrice / 3 : pricing.value.basePrice;

  if (userStore?.user) {
    senderName.value = userStore?.user?.fullName || "";
    senderEmail.value = userStore?.user?.email || "";
  }
});
</script>

<style scoped>
.pa-4 {
  padding: 16px !important;
}
</style>

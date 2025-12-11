<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import { useUserStore } from "@/stores/userStore";
import { useShipmentStore } from "@/stores/shipmentStore";
import { usePricingSettingsStore } from "@/stores/pricingSettingsStore";
import { useShipmentCalculator } from "@/composables/useShipmentCalculator";

// Stores
const userStore = useUserStore();
const shipmentStore = useShipmentStore();
const pricingStore = usePricingSettingsStore();

// Composable
const { calculatedCost, calculateCost } = useShipmentCalculator();

const router = useRouter();

// Form fields
const senderName = ref(userStore.user?.fullName || "");
const senderEmail = ref(userStore.user?.email || "");
const senderAddress = ref("");
const senderCity = ref("");

const receiverName = ref("");
const receiverEmail = ref("");
const receiverAddress = ref("");
const receiverCity = ref("");

const weight = ref("");
const dimensionLength = ref("");
const dimensionWidth = ref("");
const dimensionHeight = ref("");
const description = ref("");

const dialog = ref(false);
const submitting = ref(false);

onMounted(async () => {
  await pricingStore.fetchSettings();
});

// ======================================
// OPEN QUOTE POPUP
// ======================================
const openQuoteDialog = async () => {
  await calculateCost({
    length: parseFloat(dimensionLength.value),
    width: parseFloat(dimensionWidth.value),
    height: parseFloat(dimensionHeight.value),
    weight: parseFloat(weight.value),
    senderCity: senderCity.value,
    receiverCity: receiverCity.value,
  });

  dialog.value = true;
};

// ======================================
// CONFIRM & CREATE SHIPMENT
// ======================================
const confirmCreate = async () => {
  submitting.value = true;

  const payload = {
    senderName: senderName.value,
    senderEmail: senderEmail.value,
    senderAddress: `${senderAddress.value}, ${senderCity.value}`,

    receiverName: receiverName.value,
    receiverEmail: receiverEmail.value,
    receiverAddress: `${receiverAddress.value}, ${receiverCity.value}`,

    weight: parseFloat(weight.value),
    dimensionLength: parseFloat(dimensionLength.value),
    dimensionWidth: parseFloat(dimensionWidth.value),
    dimensionHeight: parseFloat(dimensionHeight.value),

    description: description.value,
    cost: calculatedCost.value,
  };

  try {
    const created = await shipmentStore.createShipment(payload);

    if (created?.id) {
      router.push(`/shipments/details/${created.id}`);
    } else {
      router.push("/user/shipments");
    }
  } catch (err) {
    console.error("Error creating shipment:", err);
  } finally {
    submitting.value = false;
    dialog.value = false;
  }
};
</script>

<template>
  <v-container>
    <h1>Create Transaction / Receipt</h1>

    <v-form @submit.prevent="fetchShipment">
      <v-text-field
        v-model="trackingNumber"
        label="Enter Shipment Tracking Number"
        required
        @keyup.enter="fetchShipment"
      />
      <v-btn color="primary" @click="fetchShipment" :loading="loading">
        Load Shipment
      </v-btn>
    </v-form>

    <!-- Shipment Receipt Preview -->
    <!-- Shipment Receipt Preview -->
    <div v-if="shipment" ref="receiptCard" class="receipt-wrapper pa-6 mt-6">
      <!-- Logo (replace src when ready) -->
      <div class="logo-container mb-4">
        <img src="/src/assets/logo.png" alt="Company Logo" class="company-logo" />
      </div>

      <h2 class="text-h5 text-center mb-4 receipt-title">Shipment Receipt</h2>

      <!-- Base64 preview -->
      <img ref="img" class="receipt-preview mb-4" />

      <!-- Receipt body -->
      <div class="receipt-section">
        <v-row>
          <v-col cols="6">
            <strong>Tracking Number:</strong> {{ shipment.trackingNumber }}
          </v-col>
          <v-col cols="6" class="text-right">
            <strong>Date:</strong>
            {{ new Date(shipment.createdAt).toLocaleString() }}
          </v-col>
        </v-row>
      </div>

      <div class="receipt-section">
        <h3 class="section-title">Sender Information</h3>
        <p><strong>Name:</strong> {{ shipment.sender?.name }}</p>
        <p><strong>Email:</strong> {{ shipment.sender?.email }}</p>
        <p><strong>Address:</strong> {{ shipment.sender?.address }}</p>
      </div>

      <div class="receipt-section">
        <h3 class="section-title">Receiver Information</h3>
        <p><strong>Name:</strong> {{ shipment.receiver?.name }}</p>
        <p><strong>Email:</strong> {{ shipment.receiver?.email }}</p>
        <p><strong>Address:</strong> {{ shipment.receiver?.address }}</p>
      </div>

      <div class="receipt-section">
        <h3 class="section-title">Package Details</h3>
        <p><strong>Weight:</strong> {{ shipment.package?.weight }} kg</p>
        <p>
          <strong>Dimensions:</strong>
          {{ shipment.package?.dimensions?.length }} x
          {{ shipment.package?.dimensions?.width }} x
          {{ shipment.package?.dimensions?.height }} cm
        </p>
        <p><strong>Description:</strong> {{ shipment.package?.description }}</p>
      </div>

      <div class="receipt-section">
        <h3 class="section-title">Cost</h3>
        <p class="cost-amount">${{ shipment.cost?.toLocaleString() }}</p>
      </div>

      <!-- Footer message -->
      <p class="receipt-footer text-center mt-6">
        <em>Payments are non-refundable.</em>
      </p>
    </div>

    <v-btn
      color="primary"
      class="mt-4"
      @click="generateTransaction"
      :disabled="!shipment || generating"
      :loading="generating"
    >
      Generate & Send Receipt
    </v-btn>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import html2canvas from "html2canvas";
import { useShipmentStore } from "@/stores/shipmentStore";

const trackingNumber = ref("");
const shipment = ref(null);
const loading = ref(false);
const generating = ref(false);

const receiptCard = ref(null);
const img = ref(null);

const shipmentstore = useShipmentStore();

// Fetch Shipment
async function fetchShipment() {
  if (!trackingNumber.value) return;

  loading.value = true;
  shipment.value = null;

  try {
    const res = await shipmentstore.getShipmentByTrackingNumber(trackingNumber.value);
    shipment.value = res;
  } catch (err) {
    console.error("Failed to fetch shipment:", err);
    alert("Shipment not found");
  } finally {
    loading.value = false;
  }
}

// Generate Base64 Receipt
async function generateTransaction() {
  if (!shipment.value) return;

  generating.value = true;

  try {
    const canvas = await html2canvas(receiptCard.value, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    const imageData = canvas.toDataURL("image/png");

    // 🟦 Show it in the <img>
    img.value.src = imageData;

    // 🟦 This is the Base64 you will upload
    console.log("BASE64 IMAGE:", imageData.substring(0, 100) + "...");

    // Example POST:
    // await axios.post("/transactions", {
    //   shipmentId: shipment.value._id,
    //   receiptImage: imageData
    // });

    alert("Receipt generated successfully!");
  } catch (error) {
    console.error("Error generating receipt:", error);
    alert("Error generating receipt");
  } finally {
    generating.value = false;
  }
}
</script>

<style scoped>
.pa-4 {
  padding: 16px !important;
}
.elevation-2 {
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.receipt-wrapper {
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 10px;
  width: 100%;
  max-width: 650px;
  margin: 0 auto;
}

.logo-container {
  display: flex;
  justify-content: center;
}

.company-logo {
  height: 70px;
  width: auto;
  object-fit: contain;
  opacity: 0.9;
}

.receipt-title {
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.receipt-preview {
  width: 200px;
  display: block;
  margin: 0 auto;
  border-radius: 6px;
}

.receipt-section {
  border-top: 1px dashed #ccc;
  padding-top: 12px;
  margin-top: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 6px;
  text-decoration: underline;
}

.cost-amount {
  font-size: 18px;
  font-weight: bold;
}

.receipt-footer {
  font-size: 14px;
  color: #777;
}
</style>

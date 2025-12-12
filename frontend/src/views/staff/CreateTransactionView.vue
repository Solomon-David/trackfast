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
        <p class="cost-amount">${{ shipment.cost?.toLocaleString(en_US) }}</p>
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

    <!-- Action Buttons -->
    <v-row class="mt-4" v-if="shipment">
      <v-col cols="12" md="4">
        <v-btn block color="primary" @click="downloadReceipt" :loading="downloading">
          Download Receipt
        </v-btn>
      </v-col>

      <v-col cols="12" md="4">
        <v-btn block color="success" @click="sendToSender" :loading="emailSending">
          Email to Sender
        </v-btn>
      </v-col>

      <v-col cols="12" md="4">
        <v-btn block color="info" @click="sendToReceiver" :loading="emailSending">
          Email to Receiver
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import html2canvas from "html2canvas";
import { useShipmentStore } from "@/stores/shipmentStore";

const trackingNumber = ref("");
const shipment = ref(null);
const loading = ref(false);
const downloading = ref(false);
const emailSending = ref(false);
const receiptCard = ref(null);

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

    alert("Receipt generated successfully!");
  } catch (error) {
    console.error("Error generating receipt:", error);
    alert("Error generating receipt");
  } finally {
    generating.value = false;
  }
}

async function downloadReceipt() {
  if (!receiptCard.value) return;

  downloading.value = true;

  try {
    const canvas = await html2canvas(receiptCard.value, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    const imageData = canvas.toDataURL("image/png");

    // Trigger browser download
    const link = document.createElement("a");
    link.href = imageData;
    link.download = `receipt-${shipment.value.trackingNumber}.png`;
    link.click();
  } catch (err) {
    console.error("Download error:", err);
    alert("Failed to download receipt.");
  } finally {
    downloading.value = false;
  }
}

async function sendToSender() {
  let message = `Dear ${shipment.value.sender.name},\n\nPlease find attached the receipt for your shipment with tracking number ${shipment.value.trackingNumber}.
  Your package will be delivered within 2 - 5 business days.\n\n
  Thank you for choosing our services.\n\nBest regards,\nTrackFast Logistics`;
  await sendReceiptEmail(shipment.value.sender.email, message);
}

async function sendToReceiver() {
  let message = `Dear ${shipment.value.receiver.name},\n\n You are to receive a package with tracking number ${shipment.value.trackingNumber}.
  Your package is due to be delivered within 2 - 5 business days.\n\n
  \n\nThank you for choosing our services.\n\nBest regards,\nTrackFast Logistics`;
  await sendReceiptEmail(shipment.value.receiver.email, message);
}

async function sendReceiptEmail(email, message) {
  if (!receiptCard.value) return;

  emailSending.value = true;

  try {
    const canvas = await html2canvas(receiptCard.value, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    const imageData = canvas.toDataURL("image/png");

    await shipmentstore.sendReceiptEmail(
      imageData,
      email,
      shipment.value.trackingNumber,
      message
    );

    alert(`Receipt sent to ${email}`);
  } catch (err) {
    console.error("Email error:", err);
    alert("Failed to send receipt email.");
  } finally {
    emailSending.value = false;
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

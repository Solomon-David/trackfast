<script setup>
import { ref, computed, onMounted } from "vue";
import { useTrackingStore } from "@/stores/trackingStore";
import { useRoute } from "vue-router";

const trackingNumber = ref("");
onMounted(() => {
  trackingNumber.value = useRoute().params.trackingNumber;
  searchTracking(); 
});

const trackingStore = useTrackingStore();
const error = ref("");

const trackingEvents = computed(() => trackingStore.trackingEvents);
const loading = computed(() => trackingStore.loading);

const searchTracking = async () => {
  if (!trackingNumber.value.trim()) return;
  error.value = "";
  try {
    await trackingStore.getTrackingEventsByNumber(trackingNumber.value.trim());
  } catch (err) {
    error.value = err.response?.data?.message || "Shipment not found or error occurred";
  }
};
</script>

<template>
  <v-container>
    <h1>Track Shipment</h1>

    <v-form @submit.prevent="searchTracking" class="mb-4">
      <v-row align="center">
        <v-col cols="12" sm="8">
          <v-text-field v-model="trackingNumber" label="Tracking Number" required />
        </v-col>
        <v-col cols="12" sm="4">
          <v-btn type="submit" color="primary" :loading="loading">Track</v-btn>
        </v-col>
      </v-row>
    </v-form>

    <div v-if="loading" class="text-center my-6">
      <v-progress-circular indeterminate size="48" />
    </div>

    <v-alert v-if="error" type="error" class="my-4">{{ error }}</v-alert>

    <div v-if="trackingEvents.length" class="mt-6">
      <h3>Tracking Events</h3>
      <v-timeline>
        <v-timeline-item
          v-for="(event, idx) in trackingEvents"
          :key="event._id || idx"
          :color="event.color || 'primary'"
        >
          <div class="font-weight-medium">{{ event.status }}</div>
          <div class="text--secondary">
            {{ new Date(event.createdAt).toLocaleString() }}
          </div>
          <div v-if="event.location">Location: {{ event.location }}</div>
          <div v-if="event.notes">Notes: {{ event.notes }}</div>
        </v-timeline-item>
      </v-timeline>
    </div>
  </v-container>
</template>

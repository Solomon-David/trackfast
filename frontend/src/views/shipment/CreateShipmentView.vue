// File path: /frontend/src/views/shipment/CreateShipmentView.vue
<template>
<v-container>
<h1>Create Shipment</h1>
<v-form @submit.prevent="submitShipment">
<v-text-field v-model="senderName" label="Sender Name" required />
<v-text-field v-model="receiverName" label="Receiver Name" required />
<v-text-field v-model="destination" label="Destination" required />
<v-text-field v-model="weight" label="Weight (kg)" type="number" required />
<v-text-field v-model="dimensions" label="Dimensions (LxWxH)" required />
<v-btn type="submit" color="primary">Submit Shipment</v-btn>
</v-form>
</v-container>
</template>


<script setup>
import { ref } from 'vue';
const senderName = ref('');
const receiverName = ref('');
const destination = ref('');
const weight = ref('');
const dimensions = ref('');


const submitShipment = () => {
console.log('New Shipment:', { senderName: senderName.value, receiverName: receiverName.value, destination: destination.value, weight: weight.value, dimensions: dimensions.value });
};
</script>
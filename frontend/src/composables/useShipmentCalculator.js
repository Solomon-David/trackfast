import { ref } from "vue";
import { usePricingSettingsStore } from "@/stores/pricingSettingsStore";

export function useShipmentCalculator() {
  const pricingStore = usePricingSettingsStore();
  const calculatedCost = ref(0);

  // -----------------------------------------
  // Distance Calculation (replace with API later)
  // -----------------------------------------
  async function getDistanceKm(senderCity, receiverCity) {
    if (!senderCity || !receiverCity) return 0;

    if (senderCity.trim().toLowerCase() === receiverCity.trim().toLowerCase()) {
      return 1; // same city
    }

    // TODO: Replace with Distance.to API
    return 12; // mock for now
  }

  // -----------------------------------------
  // COST CALCULATION USING PRICING MODEL
  // -----------------------------------------
  async function calculateCost({
    length,
    width,
    height,
    weight,
    senderCity,
    receiverCity,
  }) {
    const settings = pricingStore.settings || {};

    const basePrice = settings.basePrice ?? 1000;
    const pricePerKg = settings.pricePerKg ?? 250;
    const pricePerKm = settings.pricePerKm ?? 30;
    const volumetricDivisor = settings.volumetricDivisor ?? 5000;
    const minimumPrice = settings.minimumPrice ?? 1500;

    const distanceKm = await getDistanceKm(senderCity, receiverCity);

    const volumetricWeight = (length * width * height) / volumetricDivisor;
    const chargeableWeight = Math.max(weight, volumetricWeight);

    let cost =
      basePrice +
      chargeableWeight * pricePerKg +
      distanceKm * pricePerKm;

    if (cost < minimumPrice) cost = minimumPrice;

    calculatedCost.value = Math.round(cost);
    return calculatedCost.value;
  }

  return {
    calculatedCost,
    calculateCost,
  };
}

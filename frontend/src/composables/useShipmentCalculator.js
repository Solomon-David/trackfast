import { usePricingSettingsStore } from "@/stores/pricingSettingsStore";
import { estimateDistance } from "@/utils/radarInstance";

export function useShipmentCalculator() {
  const pricingStore = usePricingSettingsStore();

  // -----------------------------------------
  // Distance Calculation (replace with API later)
  // -----------------------------------------
  async function getDistanceKm(senderAddress, receiverAddress) {
    
    if (!(senderAddress && receiverAddress)) return 0;

    if (senderAddress === receiverAddress) {
      return "Yes"; // same city
    }
    // TODO: Replace with Distance.to API
    let distanceKm = await estimateDistance({
      sender:senderAddress, receiver:receiverAddress
    });
    distanceKm = Math.ceil(distanceKm); // convert to KM and round up

    return distanceKm
  }

  // -----------------------------------------
  // COST CALCULATION USING PRICING MODEL
  // -----------------------------------------
  async function calculateCost({
    length,
    width,
    height,
    weight,
    withInsurance,
    senderAddress,
    receiverAddress
  }) {
    const settings = pricingStore.settings || {};

    let basePrice = settings.basePrice ?? 1000;
    let pricePerKg = settings.pricePerKg ?? 250;
    let pricePerKm = settings.pricePerKm ?? 30;
    let volumetricDivisor = settings.volumetricDivisor ?? 5000;
    let minimumPrice = settings.minimumPrice ?? 1500;
    let insuranceFee = settings.insuranceFee ?? 500;
    let distanceKm = 0
    let cost = 0;
    distanceKm = await getDistanceKm(senderAddress, receiverAddress);
    

    let volumetricWeight = (length * width * height) / volumetricDivisor;
    let chargeableWeight = Math.max(weight, volumetricWeight);

    cost = basePrice +
      (chargeableWeight * pricePerKg) +
      (distanceKm * pricePerKm) + (withInsurance ? insuranceFee : 0);

    if (cost < minimumPrice) cost = minimumPrice;

    cost = Math.round(cost);
    return cost;
  }
  

  return {
    calculateCost,
  };
}

// /frontend/src/stores/pricingSettings.js
import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "@/utils/axiosInstance";

export const usePricingSettingsStore = defineStore("pricingSettingsStore", () => {
  const settings = ref(null);
  const loading = ref(false);

  const fetchSettings = async () => {
    loading.value = true;
    try {
      const res = await axios.get("/pricing");
      settings.value = res.data;
    } catch (err) {
      console.error("Failed to fetch pricing settings:", err);
    } finally {
      loading.value = false;
    }
  };


  const updateSettings = async (updatedData) => {
    loading.value = true;
    try {
      const res = await axios.put("/pricing-settings", updatedData);
      settings.value = res.data;
      return true;
    } catch (err) {
      console.error("Failed to update pricing settings:", err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    settings,
    loading,
    fetchSettings,
    updateSettings, 
    calculateCost
  };
});

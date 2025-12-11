import PricingSettings from "../models/PricingSettings.js";

export const getPricingSettings = async (req, res) => {
  try {
    let settings = await PricingSettings.findOne();
    if (!settings) {
      settings = await PricingSettings.create({});
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Failed to load pricing settings" });
  }
};

export const updatePricingSettings = async (req, res) => {
  try {
    const settings = await PricingSettings.findOneAndUpdate(
      {},
      { ...req.body, updatedAt: Date.now(), updatedBy: req.user?.id },
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Failed to update settings" });
  }
};

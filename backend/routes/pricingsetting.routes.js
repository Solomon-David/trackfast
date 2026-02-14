import express from "express";
import {
  getPricingSettings,
  updatePricingSettings
} from "../controllers/PricingController.js";
import {adminOnly} from "../middleware/roleMiddleware.js"


const router = express.Router();

router.get("/", getPricingSettings);
router.put("/", adminOnly, updatePricingSettings);

export default router;

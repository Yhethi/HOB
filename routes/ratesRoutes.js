import express from "express";
import {
  customRates,
  updateCustomRate,
  updateCustomRateCheckBox,
} from "../controllers/ratesController.js";

const router = express.Router();

router.get("/", customRates);
router.patch("/updateCustomRate", updateCustomRate);
router.patch("/updateCustomRateCheckBox", updateCustomRateCheckBox);

export default router;

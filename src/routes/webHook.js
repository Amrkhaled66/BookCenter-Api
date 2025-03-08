// routes/webhookRoutes.js
import { Router } from "express";
const router = Router();

import {
  handlePaymentConfirmation,
  handleTransactionExpiry,
} from "../controllers/webHookController.js";

// Route for payment confirmation webhook
router.post("/payment-confirmation",handlePaymentConfirmation);

// Route for transaction expiry webhook
router.post("/transaction-expiry", handleTransactionExpiry);

export default router;

// routes/webhookRoutes.js
import { Router } from "express";
const router = Router();
import {
  handlePaymentConfirmation,
  handleTransactionExpiry,
} from "../controllers/webHookController.js";

// Route for payment confirmation webhook
router.post("/webhook/payment-confirmation", handlePaymentConfirmation);

// Route for transaction expiry webhook
router.post("/webhook/transaction-expiry", handleTransactionExpiry);

module.exports = router;

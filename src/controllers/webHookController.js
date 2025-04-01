// controllers/webhookController.js
import crypto from "crypto";

import Order from "../models/Order.js";
import { deductReservedStock } from "./stockRecordsController.js";

// Utility function to generate hashKey
const generateHashKey = (data, secretKey) => {
  const queryParam = `InvoiceId=${data.invoice_id}&InvoiceKey=${data.invoice_key}&PaymentMethod=${data.payment_method}`;
  return crypto
    .createHmac("sha256", secretKey)
    .update(queryParam)
    .digest("hex");
};

// Handle payment confirmation webhook
const handlePaymentConfirmation = async (req, res) => {
  try {
    const { invoice_id, invoice_status, api_key } = req.body;

    // Security check for API key
    if (api_key !== process.env.FAWATERK_API_KEY) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Update order's payment status
    const updatedOrder = await Order.findOneAndUpdate(
      { invoiceId: invoice_id },
      { $set: { paymentStatus: invoice_status } },
      { new: true } 
    );

    // Handle case when order is not found
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Deduct reserved stock if payment is confirmed
    if (invoice_status === "paid") {
      const stockDeductionPromises = updatedOrder.products.map((item) =>
        deductReservedStock(item.product, item.quantity)
      );
      await Promise.allSettled(stockDeductionPromises);
    }

    res
      .status(200)
      .json({ message: "Payment confirmation received", order: updatedOrder });
  } catch (error) {
    console.error("Payment Confirmation Error:", error);
    res.status(500).json({ message: "Failed to confirm the invoice" });
  }
};

// Handle transaction expiry webhook
const handleTransactionExpiry = (req, res) => {
  // Process the transaction expiry
  res.status(200).send("Transaction expiry received");
};

export { handlePaymentConfirmation, handleTransactionExpiry };

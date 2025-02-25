// controllers/webhookController.js
const crypto = require("crypto");

// Utility function to generate hashKey
const generateHashKey = (data, secretKey) => {
  const queryParam = `InvoiceId=${data.invoice_id}&InvoiceKey=${data.invoice_key}&PaymentMethod=${data.payment_method}`;
  return crypto
    .createHmac("sha256", secretKey)
    .update(queryParam)
    .digest("hex");
};

// Handle payment confirmation webhook
const handlePaymentConfirmation = (req, res) => {
  //   const secretKey = "YOUR_FAWATERAK_VENDOR_KEY";
  //   const receivedHashKey = req.body.hashKey;
  //   const generatedHashKey = generateHashKey(req.body, secretKey);

  //   if (receivedHashKey !== generatedHashKey) {
  //     return res.status(403).send("Invalid hash key");
  //   }

  if (req.body?.api_key != process.env.FAWATERK_API_KEY) {
    return res.status(401).send("Unauthorized");
  }

  res.status(200).send("Payment confirmation received");
};

// Handle transaction expiry webhook
const handleTransactionExpiry = (req, res) => {
  const secretKey = "YOUR_FAWATERAK_VENDOR_KEY";
  const receivedHashKey = req.body.hashKey;
  const queryParam = `referenceId=${req.body.referenceId}&PaymentMethod=${req.body.paymentMethod}`;
  const generatedHashKey = crypto
    .createHmac("sha256", secretKey)
    .update(queryParam)
    .digest("hex");

  if (receivedHashKey !== generatedHashKey) {
    return res.status(403).send("Invalid hash key");
  }

  // Process the transaction expiry
  res.status(200).send("Transaction expiry received");
};

export { generateHashKey, handlePaymentConfirmation, handleTransactionExpiry };

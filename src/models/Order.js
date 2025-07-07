import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
  phone: { type: String, required: true },
  secondaryPhone: { type: String, required: true },
  productsPrice: { type: Number, required: true },
  shippingPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  invoiceId: { type: String, unique: true },
  invoiceKey: { type: String, unique: true },
  invoiceLink: { type: String, required: true },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "expired", "manual"],
    default: "pending",
  },
  shippingAddress: {
    city: { type: mongoose.Schema.Types.ObjectId, ref: "City" },
    state: { type: String },
    descriptiveAddress: { type: String },
  },
  deliveryStatus: {
    type: String,
    enum: ["pending", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  childOrders: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: [] },
  ],
  orderNumber: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  expiredAt: { type: Date },
  lastProcessedAt: { type: Date, default: null }, // <-- Add this field
});

// Create indexes for `paymentStatus` and `expiredAt`
orderSchema.index({ paymentStatus: 1, expiredAt: 1 });
orderSchema.index({ lastProcessedAt: 1 }); // <-- Index on `lastProcessedAt`

// Middleware to update `updatedAt` on changes
orderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Order", orderSchema);

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
  invoiceId: { type: String, required: true, unique: true },
  invoiceKey: { type: String, required: true, unique: true },
  invoiceLink: { type: String, required: true },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "expired"],
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
  orderNumber: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  expiredAt: { type: Date, required: true },
});

// Middleware to update `updatedAt` on changes
orderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Order", orderSchema);

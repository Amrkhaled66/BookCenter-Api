import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  skuCode: { type: String, unique: true, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number, required: true },
  stockQuantity: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, default: null },
  totalStockAdded: { type: Number, default: 0 },
  ordersCount: { type: Number, default: 0 },
  returnedToStock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  note: { type: String, default: null },
});

export default mongoose.model("Product", productSchema);

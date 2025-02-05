import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  skuCode: { type: String, unique: true, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  publisher: { type: String, required: true },
  discountPrice: { type: Number, default: null },
  stockQuantity: { type: Number, required: true },
  category: { type: String, required: true },
  subCategory: { type: String },
  year: { type: Number },
  priority: { type: Number, default: 1 },
  imageUrl: { type: String, default: null },
  totalStockAdded: { type: Number, default: 0 },
  ordersCount: { type: Number, default: 0 },
  returnedToStock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  note: { type: String, default: null },
});

export default mongoose.model("Product", productSchema);

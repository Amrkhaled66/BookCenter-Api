import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  skuCode: { type: String, unique: true, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number, default: null },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Seller",
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Category",
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
  },
  year: { type: String, default: null },
  priority: { type: Number, default: 1 },
  image: { type: String, default: null },
  items: [
    {
      type: String,
    },
  ],
  visible: { type: Boolean, default: true },
  isUnAvailable: { type: Boolean, default: false },
  isClosed: { type: Boolean, default: false },
  unAvailabilityNote: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

productSchema.index({ subject: 1, year: 1, seller: 1 });
productSchema.index({ category: 1, priority: -1 });

productSchema.pre("findByIdAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;

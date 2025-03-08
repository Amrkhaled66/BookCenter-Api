import mongoose from "mongoose";
import Product from "./Product.js";

const stockRecordSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    inStock: {
      type: Number,
    },
    totalStockAdded: {
      type: Number,
      default: 0,
    },
    totalReturned: {
      type: Number,
      default: 0,
    },
    totalDamaged: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

stockRecordSchema.post("save", async function (doc) {
  try {
    const { product, inStock } = doc;

    // Update the Product's inStock field
    await Product.findByIdAndUpdate(product, { inStock: inStock });
  } catch (error) {
    throw error;
  }
});

const StockRecord = mongoose.model("StockRecord", stockRecordSchema);
export default StockRecord;

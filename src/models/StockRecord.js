import { Schema, model } from "mongoose";

const StockRecordSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  inStock: { type: Number, required: true, default: 0 },
  totalStockAdded: { type: Number, required: true, default: 0 },
  reservedStock: { type: Number, required: true, default: 0 },
  sellerPrice: { type: Number},
  totalPaid: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  stockHistory: [
    {
      type: {
        type: String,
        required: true,
      },
      quantity: { type: Number, required: true },
      note: { type: String },
      date: { type: Date, default: Date.now },
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});

StockRecordSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default model("StockRecord", StockRecordSchema);

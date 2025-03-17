import mongoose from "mongoose";

const SellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category:{type:mongoose.Schema.Types.ObjectId,ref:"Category"},
  visible: { type: Boolean, defaultValue: true },
});

export default mongoose.model("Seller", SellerSchema);

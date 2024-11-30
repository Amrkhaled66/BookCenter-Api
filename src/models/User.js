import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: /^01[0125][0-9]{8}$/,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    city: { type: String },
    state: { type: String },
    descriptiveAddress: { type: String },
  },
  orderHistory: [
    {
      orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    },
  ],
});

export default mongoose.model("User", userSchema);

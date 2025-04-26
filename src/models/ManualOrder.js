import Order from "./Order.js";
import mongoose from "mongoose";

const ManualOrderScheme = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["بدل راجع", "بدل تالف", "مدفوع بالفعل", "هدية"],
  },
  note: {
    type: String,
  },
  parentOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    default: null,
  },
});

const ManualOrder = Order.discriminator("ManualOrder", ManualOrderScheme);

export default ManualOrder;

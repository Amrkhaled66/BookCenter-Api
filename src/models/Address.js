import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  city: { type: String, required: true ,unique:true},
  state: { type: String, required: true, index: true ,unique:true},
});

export default mongoose.model("Address", AddressSchema);

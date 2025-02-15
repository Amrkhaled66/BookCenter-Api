import mongoose from "mongoose";

const PublisherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
});

export default mongoose.model("Publisher", PublisherSchema);

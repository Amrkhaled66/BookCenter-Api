import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "Mathematics"
});

export default mongoose.model("Subject", subjectSchema);

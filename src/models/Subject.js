import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  visible: { type: Boolean, defaultValue: true },
});

export default mongoose.model("Subject", subjectSchema);

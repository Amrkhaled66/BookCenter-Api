import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
});

export default mongoose.model("Grade", gradeSchema);

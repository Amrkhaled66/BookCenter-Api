import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["superAdmin", "admin", "moderator"],
    default: "admin",
  },
});

export default mongoose.model("Admin", adminSchema);

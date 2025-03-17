import mongoose from "mongoose";

// Define the schema for Category
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  visible: {
    type: Boolean,
    default: true,
  },
});

// Create the model from the schema
const Category = mongoose.model("Category", categorySchema);

export default Category;

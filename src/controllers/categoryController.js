import Category from "../models/Category.js";

export const addNewCategory = async (req, res) => {
  try {
    const { name, visible } = req.body;

    const newCategory = new Category({ name, visible });

    await newCategory.save();

    res
      .status(201)
      .json({ message: "Category added successfully", category: newCategory });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding category", error: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching categories", error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.query;
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting category", error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.query;
    const { name, visible } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, visible },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating category", error: error.message });
  }
};

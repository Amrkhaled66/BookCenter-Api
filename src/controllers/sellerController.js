import Seller from "../models/Seller.js";

export const addNewSeller = async (req, res) => {
  try {
    const { name, visible, category } = req.body;

    const newSeller = new Seller({ name, visible, category });

    await newSeller.save();

    res
      .status(201)
      .json({ message: "Seller added successfully", seller: newSeller });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding seller", error: error.message });
  }
};

export const getAllSellers = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = {};
    if (category) {
      filter.category = category;
    }

    const sellers = await Seller.find(filter).populate("category", "name");

    res.status(200).json(sellers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching sellers", error: error.message });
  }
};

export const deleteSeller = async (req, res) => {
  try {
    const { id } = req.query;
    const deletedSeller = await Seller.findByIdAndDelete(id);

    if (!deletedSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json({ message: "Seller deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting seller", error: error.message });
  }
};

export const updateSeller = async (req, res) => {
  try {
    const { id } = req.query;
    const { name, visible, category } = req.body;

    const updatedSeller = await Seller.findByIdAndUpdate(
      id,
      { name, visible, category },
      { new: true, runValidators: true }
    );

    if (!updatedSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json({
      message: "Seller updated successfully",
      seller: updatedSeller,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating seller", error: error.message });
  }
};

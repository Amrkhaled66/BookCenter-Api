import Subject from "../models/Subject.js";

export const addNewSubject = async (req, res) => {
  try {
    const { name, visible } = req.body;

    const newSubject = new Subject({ name, visible });

    await newSubject.save();

    res
      .status(201)
      .json({ message: "Subject added successfully", subject: newSubject });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding subject", error: error.message });
  }
};

export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching subjects", error: error.message });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.query;
    const deletedSubject = await Subject.findByIdAndDelete(id);

    if (!deletedSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting subject", error: error.message });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const { id } = req.query;
    const { name, visible } = req.body;

    const updatedSubject = await Subject.findByIdAndUpdate(
      id,
      { name, visible },
      { new: true, runValidators: true }
    );

    if (!updatedSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json({
      message: "Subject updated successfully",
      subject: updatedSubject,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating subject", error: error.message });
  }
};

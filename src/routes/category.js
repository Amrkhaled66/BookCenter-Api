import Router from "express";
import {
  addNewCategory,
  getAllCategories,
  deleteCategory,
  updateCategory,
} from "../controllers/categoryController.js";
import isAdmin from "../middleware/checkAdmin.js";

const router = Router();

router.post("/add", isAdmin, addNewCategory);
router.get("/get", getAllCategories);
router.patch("/update", isAdmin, updateCategory);
router.delete("/delete", isAdmin, deleteCategory);

export default router;

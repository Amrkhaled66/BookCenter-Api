import Router from "express";
import {
  addNewSubject,
  getAllSubjects,
  deleteSubject,
  updateSubject,
} from "../controllers/subjectControllers.js";
import isAdmin from "../middleware/checkAdmin.js";

const router = Router();

router.post("/add", isAdmin, addNewSubject);
router.get("/get", getAllSubjects);
router.patch("/update", isAdmin, updateSubject);
router.delete("/delete", isAdmin, deleteSubject);

export default router;

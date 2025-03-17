import Router from "express";
import {
  addNewSeller,
  getAllSellers,
  updateSeller,
  deleteSeller,
} from "../controllers/sellerController.js";
import isAdmin from "../middleware/checkAdmin.js";

const router = Router();

router.post("/add", isAdmin, addNewSeller);
router.get("/get", getAllSellers);
router.patch("/update", isAdmin, updateSeller);
router.delete("/delete", isAdmin, deleteSeller);

export default router;

import { Router } from "express";
import {
  getOrdersController,
  updateUserController,
  getProfileController,
} from "../controllers/userController.js";
import checkAuth from "../middleware/checkAuth.js";
import checkAdmin from "../middleware/checkAdmin.js";
const router = Router();

router.get("/orders", checkAuth, getOrdersController);
router.patch("/updateProfile", checkAuth, updateUserController);
router.get("/getUserProfile", checkAdmin, getProfileController);

export default router;

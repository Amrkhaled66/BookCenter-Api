import { Router } from "express";
import {
  getOrdersController,
  updateUserController,
} from "../controllers/userController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = Router();

router.get("/orders", checkAuth, getOrdersController);
router.patch("/updateProfile", checkAuth, updateUserController);

export default router;

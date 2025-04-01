import { Router } from "express";
import checkAuth from "../middleware/checkAuth.js";

import {
  addOrderController,
  getExpiredOrders,
} from "../controllers/ordersController.js";

import checkAdmin from "../middleware/checkAdmin.js";

const router = Router();

router.post("/add", checkAuth, addOrderController);
router.get("/getExpiredOrders", checkAdmin, getExpiredOrders);

export default router;

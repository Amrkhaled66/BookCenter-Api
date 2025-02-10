import { Router } from "express";
import checkAuth from "../middleware/checkAuth.js";

import { addOrderController } from "../controllers/ordersController.js";

const router = Router();

router.post("/add", checkAuth ,addOrderController);

export default router;

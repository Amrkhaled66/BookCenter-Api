import { Router } from "express";
import { getOrdersController } from "../controllers/userController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = Router();

router.get("/orders", checkAuth, getOrdersController);

export default router;

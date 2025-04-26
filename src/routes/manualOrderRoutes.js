import { addManualOrder } from "../controllers/manualOrderController.js";
import isAdmin from "../middleware/checkAdmin.js";
import Router from "express";
const router = Router();

router.post("/add", isAdmin, addManualOrder);

export default router;

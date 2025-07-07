import express from "express";
import { orderAnalytics } from "../controllers/analyticsController.js";
import checkAdmin from "../middleware/checkAdmin.js";

const router = express.Router();
// GET /api/admin/order-analytics

router.get("/order-analytics",orderAnalytics);

export default router;

import { addToCart } from "../controllers/cartController.js";
import { Router } from "express";
import checkAuth from "../middleware/checkAuth.js";

const router = Router();

router.post("/addToCart", checkAuth, addToCart);

export default router;

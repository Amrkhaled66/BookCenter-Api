import { Router } from "express";

const router = Router();

import {
  getAllProducts,
  upload,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductById
} from "../controllers/productController.js";

router.get("/", getAllProducts);

router.post("/", upload.single("imageUrl"), addProduct);
// , checkAuth
router.patch("/:productId", updateProduct);

router.get("/:productId", getProductById);

router.delete("/:productId", deleteProduct);

export default router;

import { Router } from "express";

const router = Router();

import {
  getAllProducts,
  upload,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getOptions,
} from "../controllers/productController.js";

import isAdmin from "../middleware/checkAdmin.js";

router.get("/", getAllProducts);
router.get("/getOptions", getOptions);

router.post("/add", isAdmin, upload.single("image"), addProduct);

router.patch("/:productId", isAdmin, upload.single("image"), updateProduct);

router.get("/:productId", getProductById);
router.delete("/:productId", isAdmin, deleteProduct);

export default router;

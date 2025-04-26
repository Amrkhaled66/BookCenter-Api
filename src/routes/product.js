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
  getProduct4Admin,
  getProductByName4Admin,
} from "../controllers/productController.js";

import isAdmin from "../middleware/checkAdmin.js";

router.get("/getOptions", getOptions);

router.post("/add", isAdmin, upload.single("image"), addProduct);

router.patch("/:productId", isAdmin, upload.single("image"), updateProduct);

router.delete("/:productId", isAdmin, deleteProduct);

router.get("/admin/getProductByName", isAdmin, getProductByName4Admin);
router.get("/admin/:productId", isAdmin, getProduct4Admin);
router.get("/user", getAllProducts);
router.get("/:productId", getProductById);
export default router;

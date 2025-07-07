import Router from "express";
import {
  addStock,
  moveReservedToInStock,
  deductReservedStock,
  checkAndAdjustStock,
  getStockRecordById,
} from "../controllers/stockRecordsController.js";
import isAdmin from "../middleware/checkAdmin.js";

const router = Router();

// Route to add stock
router.patch("/addToStock", isAdmin, addStock);

// Route to move reserved stock to in-stock
router.post("/move-reserved", isAdmin, moveReservedToInStock);

// Route to deduct reserved stock
router.post("/deduct-reserved", isAdmin, deductReservedStock);

// Route to reserve stock

router.post("/check-and-edit-cart", checkAndAdjustStock);

router.get("/:id", isAdmin, getStockRecordById);

// router.post("/releaseReservedStock", isAdmin, releaseReservedStock);


export default router;

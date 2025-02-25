import { Router } from "express";
import checkAuth from "../middleware/checkAuth.js";
import { createInvoiceController } from "../controllers/invoiceController.js";

const router = Router();

router.post("/createInvoice", checkAuth, createInvoiceController);

export default router;

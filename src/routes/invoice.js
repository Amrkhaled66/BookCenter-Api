import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import { createInvoiceController } from "../controllers/invoiceController.js";

const router = express.Router();

router.post("/createInvoice", checkAuth, createInvoiceController);

export default router;

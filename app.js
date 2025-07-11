// src/app.js
import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";

// import helmet from "helmet";

import {
  errorHandler,
  notFoundHandler,
} from "./src/middleware/errorMiddleware.js";
// Routes
import productsRoutes from "./src/routes/product.js";
import authRoutes from "./src/routes/auth.js";
import cartRoutes from "./src/routes/cart.js";
import userRoutes from "./src/routes/user.js";
import orderRoutes from "./src/routes/order.js";
import cityRoutes from "./src/routes/city.js";
import invoiceRoutes from "./src/routes/invoice.js";
import webHooksRoutes from "./src/routes/webHook.js";
import adminRoutes from "./src/routes/Admin.js";
import categoryRoutes from "./src/routes/category.js";
import subjectRoutes from "./src/routes/subject.js";
import sellerRoutes from "./src/routes/seller.js";
import stockRecord from "./src/routes/stock.js";
import manualOrderRoutes from "./src/routes/manualOrderRoutes.js";
import configRoutes from "./src/routes/config.js";
import analyticsRoutes from "./src/routes/analytics.js"

const app = express();
// app.use(mongoSanitize());

// Middleware setup
// app.use(helmet());

const urls = ["https://book-center.netlify.app", "http://localhost:5173"];

app.use(cors(
  {
    origin:["http://localhost:3001", "https://book-center.netlify.app"],
    credentials: true
  }
))

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/images", express.static("./images"));

// API routes
app.use("/products", productsRoutes);
app.use("/auth", authRoutes);
app.use("/cart", cartRoutes);
app.use("/user", userRoutes);
app.use("/order", orderRoutes);
app.use("/city", cityRoutes);
app.use("/invoice", invoiceRoutes);
app.use("/webhook", webHooksRoutes);
app.use("/admin", adminRoutes);
app.use("/category", categoryRoutes);
app.use("/subject", subjectRoutes);
app.use("/seller", sellerRoutes);
app.use("/stock", stockRecord);
app.use("/manualOrder", manualOrderRoutes);
app.use("/site-config", configRoutes);
app.use("/analytics", analyticsRoutes);

app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;

// Api versioning
// ORM
// semantic versioning


process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
})
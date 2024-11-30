// src/app.js
import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";

// import helmet from "helmet";

import {
  errorHandler,
  notFoundHandler,
} from "./src/middleware/errorMiddleware.js";
// Routes
import productsRoutes from "./src/routes/product.js";
import userRoutes from "./src/routes/user.js";
// Initialize the Express app
const app = express();
app.use(mongoSanitize());
// Middleware setup
// app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/products", productsRoutes);
app.use("/user", userRoutes);
// app.use("/orders", orderRoutes);
// app.use("/cart", cartRoutes);

// 404 Not Found handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;

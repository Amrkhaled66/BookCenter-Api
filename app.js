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
import userRoutes from "./src/routes/user.js";
import cartRoutes from "./src/routes/cart.js";
// Initialize the Express app

const app = express();
// app.use(mongoSanitize());

// Middleware setup
// app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/images", express.static("./images"));

// API routes
app.use("/products", productsRoutes);
app.use("/user", userRoutes);
app.use("/cart", cartRoutes);
// app.use("/orders", orderRoutes);

// 404 Not Found handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;

// Api versioning
// ORM
// semantic versioning

import { Router } from "express";
import rateLimit from "express-rate-limit";

import {
  signUpController,
  loginController,
  getProfileController
} from "../controllers/userController";

import checkAuth from "../middleware/check-auth.js";

// middleware
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again later.",
});

const router = Router();

// Authentication
router.post("/signup", signUpController);
router.post("/login", loginLimiter, loginController);

// profile
router.get("/profile", checkAuth, getProfileController);
router.patch("/profile", checkAuth, );

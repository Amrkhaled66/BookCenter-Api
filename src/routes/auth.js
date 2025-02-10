import { Router } from "express";
import rateLimit from "express-rate-limit";

import {
  signUpController,
  loginController,
  refresh,
  logout
} from "../controllers/authController.js";


// middleware
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again later.",
});

const router = Router();

// // Authentication
router.post("/signup", signUpController);
router.post("/login", loginController);
router.get("/refreshToken", refresh);
router.post("/logout", logout);


export default router;
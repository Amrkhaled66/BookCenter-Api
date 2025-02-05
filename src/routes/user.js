import { Router } from "express";
import rateLimit from "express-rate-limit";

import {
  signUpController,
  loginController,
  getProfileController,
  refresh,
  logout
} from "../controllers/userController.js";

import checkAuth from "../middleware/checkAuth.js";
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
router.get("/logout", logout);

// profile
router.get("/profile", checkAuth,getProfileController);
// // router.patch("/profile", checkAuth, );

export default router;

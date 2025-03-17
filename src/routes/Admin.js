import { Router } from "express";
import checkAdmin from "../middleware/checkAdmin.js";

import {
  registerAdmin,
  loginAdmin,
  logout,
  refresh,
  loginAsUser
} from "../controllers/adminAuthController.js";

const router = Router();

router.post("/register", registerAdmin);
router.post("/loginAdmin", loginAdmin);
router.post("/logoutAdmin", logout);
router.post("/refreshAdmin", refresh);
router.post("/loginAsUser", checkAdmin, loginAsUser);

export default router;

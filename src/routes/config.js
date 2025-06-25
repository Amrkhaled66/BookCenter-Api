import { Router } from "express";
import checkAdmin from "../middleware/checkAdmin.js";
const router = Router();

import {
  updateSiteConfig,
  getSiteConfig,
} from "../controllers/siteConfigControllers.js";

// GET config
router.get("/", getSiteConfig);

// PUT to update config
router.put("/", checkAdmin, updateSiteConfig);

export default router;

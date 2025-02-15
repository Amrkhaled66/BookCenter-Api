import Router from "express";
import {
  addCity,
  addStatesToCity,
  getCities,
  getCityStates,
} from "../controllers/cityController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = Router();

router.get("/getCities", checkAuth, getCities);
router.post("/addCity", addCity);
router.post("/addStateToCity", addStatesToCity);
router.get("/getCityStates", checkAuth, getCityStates);

export default router;

import { Router } from "express";
import {
  createCareer,
  getCareers,
  getCareerById,
  updateCareer,
  deleteCareer,
} from "../controllers/career.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getCareers);
router.get("/:id", getCareerById);
router.post("/", requireAuth, createCareer);
router.put("/:id", requireAuth, updateCareer);
router.delete("/:id", requireAuth, deleteCareer);

export default router;

import { Router } from "express";
import { getStats, trackVisit } from "../controllers/dashboard.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/stats", requireAuth, getStats);
router.post("/track", trackVisit);

export default router;

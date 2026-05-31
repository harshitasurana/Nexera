import { Router } from "express";
import { login, seedAdmin, verifyToken } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/login", login);
router.post("/seed", seedAdmin);
router.get("/verify", requireAuth, verifyToken);

export default router;

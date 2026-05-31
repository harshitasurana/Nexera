import { Router } from "express";
import { subscribe, getSubscribers, unsubscribe } from "../controllers/newsletter.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/", subscribe);
router.get("/", requireAuth, getSubscribers);
router.delete("/:email", requireAuth, unsubscribe);

export default router;

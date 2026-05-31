import { Router } from "express";
import { createProject, getProjects, updateProject } from "../controllers/project.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/", createProject);
router.get("/", requireAuth, getProjects);
router.put("/:id", requireAuth, updateProject);

export default router;

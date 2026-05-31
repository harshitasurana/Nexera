import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth.routes";
import contactRouter from "./contact.routes";
import newsletterRouter from "./newsletter.routes";
import projectRouter from "./project.routes";
import blogRouter from "./blog.routes";
import careerRouter from "./career.routes";
import dashboardRouter from "./dashboard.routes";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/contact", contactRouter);
router.use("/newsletter", newsletterRouter);
router.use("/projects", projectRouter);
router.use("/blogs", blogRouter);
router.use("/careers", careerRouter);
router.use("/dashboard", dashboardRouter);

export default router;

import type { Request, Response } from "express";
import ProjectInquiry from "../models/ProjectInquiry";
import Analytics from "../models/Analytics";
import { logger } from "../lib/logger";

export async function createProject(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, company, budget, projectType, timeline, requirements } = req.body as Record<string, string>;
    if (!name || !email || !projectType || !requirements) {
      res.status(400).json({ success: false, message: "Required: name, email, projectType, requirements" });
      return;
    }
    const inquiry = await ProjectInquiry.create({ name, email, company, budget, projectType, timeline, requirements });
    await Analytics.create({ event: "project_request", metadata: { projectType, email } }).catch(() => null);
    res.status(201).json({ success: true, message: "Project inquiry submitted!", data: inquiry });
  } catch (err) {
    logger.error({ err }, "Create project inquiry error");
    res.status(500).json({ success: false, message: "Failed to submit inquiry" });
  }
}

export async function getProjects(req: Request, res: Response): Promise<void> {
  try {
    const { status, page = "1", limit = "20" } = req.query as Record<string, string>;
    const query: Record<string, unknown> = {};
    if (status && status !== "all") query["status"] = status;
    const skip = (Number(page) - 1) * Number(limit);
    const [inquiries, total] = await Promise.all([
      ProjectInquiry.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      ProjectInquiry.countDocuments(query),
    ]);
    res.json({ success: true, data: inquiries, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    logger.error({ err }, "Get projects error");
    res.status(500).json({ success: false, message: "Failed to fetch inquiries" });
  }
}

export async function updateProject(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const { status } = req.body as { status?: string };
    const inquiry = await ProjectInquiry.findByIdAndUpdate(id, { status }, { new: true });
    if (!inquiry) { res.status(404).json({ success: false, message: "Inquiry not found" }); return; }
    res.json({ success: true, data: inquiry });
  } catch (err) {
    logger.error({ err }, "Update project error");
    res.status(500).json({ success: false, message: "Failed to update" });
  }
}

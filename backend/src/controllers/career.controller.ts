import type { Request, Response } from "express";
import Career, { type ICareer } from "../models/Career";
import { logger } from "../lib/logger";

export async function createCareer(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body as Partial<ICareer>;
    if (!body.title || !body.department || !body.location || !body.description) {
      res.status(400).json({ success: false, message: "Title, department, location, and description are required" });
      return;
    }
    const career = await Career.create(body);
    res.status(201).json({ success: true, data: career });
  } catch (err) {
    logger.error({ err }, "Create career error");
    res.status(500).json({ success: false, message: "Failed to create job opening" });
  }
}

export async function getCareers(req: Request, res: Response): Promise<void> {
  try {
    const { status, department, page = "1", limit = "20" } = req.query as Record<string, string>;
    const query: Record<string, unknown> = {};
    if (status) query["status"] = status;
    if (department) query["department"] = department;
    const skip = (Number(page) - 1) * Number(limit);
    const [careers, total] = await Promise.all([
      Career.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Career.countDocuments(query),
    ]);
    res.json({ success: true, data: careers, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    logger.error({ err }, "Get careers error");
    res.status(500).json({ success: false, message: "Failed to fetch careers" });
  }
}

export async function getCareerById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const career = await Career.findById(id);
    if (!career) {
      res.status(404).json({ success: false, message: "Job opening not found" });
      return;
    }
    res.json({ success: true, data: career });
  } catch (err) {
    logger.error({ err }, "Get career error");
    res.status(500).json({ success: false, message: "Failed to fetch job opening" });
  }
}

export async function updateCareer(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const career = await Career.findByIdAndUpdate(id, req.body as Record<string, unknown>, {
      new: true,
      runValidators: true,
    });
    if (!career) {
      res.status(404).json({ success: false, message: "Job opening not found" });
      return;
    }
    res.json({ success: true, data: career });
  } catch (err) {
    logger.error({ err }, "Update career error");
    res.status(500).json({ success: false, message: "Failed to update job opening" });
  }
}

export async function deleteCareer(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    await Career.findByIdAndDelete(id);
    res.json({ success: true, message: "Job opening deleted" });
  } catch (err) {
    logger.error({ err }, "Delete career error");
    res.status(500).json({ success: false, message: "Failed to delete job opening" });
  }
}

import type { Request, Response } from "express";
import Blog, { type IBlog } from "../models/Blog";
import { logger } from "../lib/logger";

export async function createBlog(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body as Partial<IBlog> & { tags?: string[] };

    if (!body.title || !body.content) {
      res.status(400).json({
        success: false,
        message: "Title and content required",
      });
      return;
    }

    const slug =
      body.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const blog = await Blog.create({
      ...body,
      slug,
    });

    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (err: unknown) {
    if ((err as { code?: number }).code === 11000) {
      res.status(409).json({
        success: false,
        message: "Slug already exists",
      });
      return;
    }

    logger.error({ err }, "Create blog error");

    res.status(500).json({
      success: false,
      message: "Failed to create blog",
    });
  }
}

export async function getBlogs(req: Request, res: Response): Promise<void> {
  try {
    const { published, category, page = "1", limit = "10" } = req.query as Record<string, string>;
    const query: Record<string, unknown> = {};
    if (published !== undefined) query["published"] = published === "true";
    if (category) query["category"] = category;
    const skip = (Number(page) - 1) * Number(limit);
    const [blogs, total] = await Promise.all([
      Blog.find(query).select("-content").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Blog.countDocuments(query),
    ]);
    res.json({ success: true, data: blogs, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    logger.error({ err }, "Get blogs error");
    res.status(500).json({ success: false, message: "Failed to fetch blogs" });
  }
}

export async function getBlogBySlug(req: Request, res: Response): Promise<void> {
  try {
    const { slug } = req.params as { slug: string };
    const blog = await Blog.findOne({ slug, published: true });
    if (!blog) { res.status(404).json({ success: false, message: "Blog not found" }); return; }
    res.json({ success: true, data: blog });
  } catch (err) {
    logger.error({ err }, "Get blog error");
    res.status(500).json({ success: false, message: "Failed to fetch blog" });
  }
}

export async function updateBlog(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const blog = await Blog.findByIdAndUpdate(id, req.body as Record<string, unknown>, { new: true, runValidators: true });
    if (!blog) { res.status(404).json({ success: false, message: "Blog not found" }); return; }
    res.json({ success: true, data: blog });
  } catch (err) {
    logger.error({ err }, "Update blog error");
    res.status(500).json({ success: false, message: "Failed to update blog" });
  }
}

export async function deleteBlog(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    await Blog.findByIdAndDelete(id);
    res.json({ success: true, message: "Blog deleted" });
  } catch (err) {
    logger.error({ err }, "Delete blog error");
    res.status(500).json({ success: false, message: "Failed to delete blog" });
  }
}

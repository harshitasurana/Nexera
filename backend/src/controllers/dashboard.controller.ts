import type { Request, Response } from "express";
import Contact from "../models/Contact";
import Newsletter from "../models/Newsletter";
import ProjectInquiry from "../models/ProjectInquiry";
import Blog from "../models/Blog";
import Analytics from "../models/Analytics";
import { logger } from "../lib/logger";

export async function getStats(req: Request, res: Response): Promise<void> {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalLeads, newLeads, monthlyLeads, subscribers, projectInquiries, publishedBlogs] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ status: "New" }),
      Contact.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Newsletter.countDocuments(),
      ProjectInquiry.countDocuments(),
      Blog.countDocuments({ published: true }),
    ]);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyData = await Contact.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyChart = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - 5 + i);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const found = monthlyData.find((m) => m._id.year === year && m._id.month === month);
      return { month: months[d.getMonth()], leads: found?.count ?? 0 };
    });

    const serviceData = await Contact.aggregate([
      { $group: { _id: "$service", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const recentLeads = await Contact.find().sort({ createdAt: -1 }).limit(8);

    res.json({
      success: true,
      data: {
        totalLeads,
        newLeads,
        monthlyLeads,
        subscribers,
        projectInquiries,
        publishedBlogs,
        monthlyChart,
        serviceChart: serviceData.map((s) => ({ service: s._id ?? "Other", count: s.count as number })),
        recentLeads,
      },
    });
  } catch (err) {
    logger.error({ err }, "Dashboard stats error");
    res.status(500).json({ success: false, message: "Failed to fetch dashboard stats" });
  }
}

export async function trackVisit(req: Request, res: Response): Promise<void> {
  try {
    await Analytics.create({ event: "visit", metadata: { path: req.body } });
    res.status(204).end();
  } catch {
    res.status(204).end();
  }
}

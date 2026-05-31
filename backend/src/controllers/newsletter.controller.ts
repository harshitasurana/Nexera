import type { Request, Response } from "express";
import Newsletter from "../models/Newsletter";
import Analytics from "../models/Analytics";
import { sendNewsletterConfirmation } from "../services/email.service";
import { logger } from "../lib/logger";

export async function subscribe(req: Request, res: Response): Promise<void> {
  try {
    const { email } = req.body as { email?: string };
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ success: false, message: "Valid email required" });
      return;
    }

    const existing = await Newsletter.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      res.status(409).json({ success: false, message: "Already subscribed" });
      return;
    }

    await Newsletter.create({ email });
    await Analytics.create({ event: "newsletter_signup", metadata: { email } }).catch(() => null);

    sendNewsletterConfirmation(email).catch((e) => logger.warn({ e }, "Newsletter confirmation email failed"));

    res.status(201).json({ success: true, message: "Successfully subscribed!" });
  } catch (err) {
    logger.error({ err }, "Newsletter subscribe error");
    res.status(500).json({ success: false, message: "Failed to subscribe" });
  }
}

export async function getSubscribers(req: Request, res: Response): Promise<void> {
  try {
    const [subscribers, total] = await Promise.all([
      Newsletter.find().sort({ subscribedAt: -1 }),
      Newsletter.countDocuments(),
    ]);
    res.json({ success: true, data: subscribers, total });
  } catch (err) {
    logger.error({ err }, "Get subscribers error");
    res.status(500).json({ success: false, message: "Failed to fetch subscribers" });
  }
}

export async function unsubscribe(req: Request, res: Response): Promise<void> {
  try {
    const { email } = req.params as { email: string };
    await Newsletter.findOneAndDelete({ email: decodeURIComponent(email) });
    res.json({ success: true, message: "Unsubscribed" });
  } catch (err) {
    logger.error({ err }, "Unsubscribe error");
    res.status(500).json({ success: false, message: "Failed to unsubscribe" });
  }
}

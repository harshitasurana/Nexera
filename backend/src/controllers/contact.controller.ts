import type { Request, Response } from "express";
import Contact from "../models/Contact";
import Analytics from "../models/Analytics";
import { sendContactConfirmation, sendAdminNotification } from "../services/email.service";
import { logger } from "../lib/logger";

export async function createContact(req: Request, res: Response): Promise<void> {
  try {
    const { firstName, lastName, email, company, service, message } = req.body as Record<string, string>;

    if (!firstName || !lastName || !email || !service || !message) {
      res.status(400).json({ success: false, message: "Required fields: firstName, lastName, email, service, message" });
      return;
    }

    const contact = await Contact.create({ firstName, lastName, email, company: company ?? "", service, message });

    await Analytics.create({ event: "contact_form", metadata: { service, email } }).catch(() => null);

    sendContactConfirmation({ to: email, firstName, lastName, company: company ?? "", service, message }).catch(
      (e) => logger.warn({ e }, "Confirmation email failed"),
    );
    sendAdminNotification({ to: email, firstName, lastName, company: company ?? "", service, message }).catch(
      (e) => logger.warn({ e }, "Admin notification email failed"),
    );

    res.status(201).json({ success: true, message: "Message received! We'll get back to you within 24 hours.", data: contact });
  } catch (err) {
    logger.error({ err }, "Create contact error");
    res.status(500).json({ success: false, message: "Failed to submit contact form" });
  }
}

export async function getContacts(req: Request, res: Response): Promise<void> {
  try {
    const { search, status, page = "1", limit = "20" } = req.query as Record<string, string>;
    const query: Record<string, unknown> = {};

    if (status && status !== "all") query["status"] = status;
    if (search) {
      query["$or"] = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [contacts, total] = await Promise.all([
      Contact.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Contact.countDocuments(query),
    ]);

    res.json({ success: true, data: contacts, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    logger.error({ err }, "Get contacts error");
    res.status(500).json({ success: false, message: "Failed to fetch contacts" });
  }
}

export async function updateContact(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const { status } = req.body as { status?: string };
    const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true });
    if (!contact) { res.status(404).json({ success: false, message: "Contact not found" }); return; }
    res.json({ success: true, data: contact });
  } catch (err) {
    logger.error({ err }, "Update contact error");
    res.status(500).json({ success: false, message: "Failed to update contact" });
  }
}

export async function deleteContact(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    await Contact.findByIdAndDelete(id);
    res.json({ success: true, message: "Contact deleted" });
  } catch (err) {
    logger.error({ err }, "Delete contact error");
    res.status(500).json({ success: false, message: "Failed to delete contact" });
  }
}

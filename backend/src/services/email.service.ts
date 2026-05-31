import nodemailer, { type Transporter } from "nodemailer";
import { logger } from "../lib/logger";

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (transporter) return transporter;

  const host = process.env["EMAIL_HOST"];
  const user = process.env["EMAIL_USER"];
  const pass = process.env["EMAIL_PASS"];

  if (!host || !user || !pass) {
    logger.warn("Email env vars not set — emails will not be sent");
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port: Number(process.env["EMAIL_PORT"] ?? 587),
    secure: process.env["EMAIL_SECURE"] === "true",
    auth: { user, pass },
  });

  return transporter;
}

interface ContactEmailOptions {
  to: string;
  firstName: string;
  lastName: string;
  company: string;
  service: string;
  message: string;
}

export async function sendContactConfirmation(opts: ContactEmailOptions): Promise<void> {
  const t = getTransporter();
  if (!t) return;

  const from = `"Nexera" <${process.env["EMAIL_USER"]}>`;

  await t.sendMail({
    from,
    to: opts.to,
    subject: "Thank you for contacting Nexera",
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
        <h2 style="margin-top:0;">Hi ${opts.firstName},</h2>
        <p>Thank you for reaching out to <strong>Nexera</strong>. We've received your inquiry and our team will get back to you within 24 hours.</p>
        <p style="color: rgba(255,255,255,0.5);">Service requested: <strong style="color:#fff">${opts.service}</strong></p>
        <hr style="border-color: rgba(255,255,255,0.08); margin: 24px 0;" />
        <p style="color: rgba(255,255,255,0.4); font-size:13px;">Nexera — Intelligent digital solutions for modern businesses.</p>
      </div>
    `,
  });
}

export async function sendAdminNotification(opts: ContactEmailOptions): Promise<void> {
  const t = getTransporter();
  const adminEmail = process.env["ADMIN_EMAIL"] ?? process.env["EMAIL_USER"];
  if (!t || !adminEmail) return;

  const from = `"Nexera System" <${process.env["EMAIL_USER"]}>`;

  await t.sendMail({
    from,
    to: adminEmail,
    subject: `New Lead: ${opts.firstName} ${opts.lastName} — ${opts.service}`,
    html: `
      <div style="font-family: monospace; max-width: 600px;">
        <h3>New Contact Lead</h3>
        <table style="width:100%; border-collapse:collapse;">
          <tr><td style="padding:6px; color:#666;">Name</td><td style="padding:6px;">${opts.firstName} ${opts.lastName}</td></tr>
          <tr><td style="padding:6px; color:#666;">Email</td><td style="padding:6px;">${opts.to}</td></tr>
          <tr><td style="padding:6px; color:#666;">Company</td><td style="padding:6px;">${opts.company}</td></tr>
          <tr><td style="padding:6px; color:#666;">Service</td><td style="padding:6px;">${opts.service}</td></tr>
          <tr><td style="padding:6px; color:#666;">Message</td><td style="padding:6px;">${opts.message}</td></tr>
        </table>
      </div>
    `,
  });
}

export async function sendNewsletterConfirmation(email: string): Promise<void> {
  const t = getTransporter();
  if (!t) return;

  await t.sendMail({
    from: `"Nexera" <${process.env["EMAIL_USER"]}>`,
    to: email,
    subject: "You're subscribed to Nexera updates",
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px;">
        <h2>Welcome aboard</h2>
        <p>You've successfully subscribed to Nexera's newsletter. We'll keep you updated with our latest projects, insights, and technology trends.</p>
        <p style="color:#666; font-size:13px;">Nexera — Intelligent digital solutions for modern businesses.</p>
      </div>
    `,
  });
}

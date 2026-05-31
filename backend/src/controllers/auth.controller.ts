import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin";
import { logger } from "../lib/logger";

const getSecret = () => process.env["JWT_SECRET"] ?? process.env["SESSION_SECRET"] ?? "nexera-dev-secret";

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email and password required" });
      return;
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const valid = await (admin as unknown as { comparePassword(p: string): Promise<boolean> }).comparePassword(password);
    if (!valid) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ adminId: admin._id?.toString() }, getSecret(), { expiresIn: "7d" });
    res.json({ success: true, token, admin: { email: admin.email, name: admin.name } });
  } catch (err) {
    logger.error({ err }, "Login error");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function seedAdmin(req: Request, res: Response): Promise<void> {
  try {
    const count = await Admin.countDocuments();
    if (count > 0) {
      res.status(400).json({ success: false, message: "Admin already exists" });
      return;
    }
    const { email, password, name } = req.body as { email?: string; password?: string; name?: string };
    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email and password required" });
      return;
    }
    const admin = await Admin.create({ email, password, name: name ?? "Admin" });
    res.status(201).json({ success: true, message: "Admin created", admin: { email: admin.email, name: admin.name } });
  } catch (err) {
    logger.error({ err }, "Seed admin error");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function verifyToken(req: Request, res: Response): Promise<void> {
  res.json({ success: true, message: "Token valid" });
}

import { Router } from "express";
import { createContact, getContacts, updateContact, deleteContact } from "../controllers/contact.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/", createContact);
router.get("/", requireAuth, getContacts);
router.put("/:id", requireAuth, updateContact);
router.delete("/:id", requireAuth, deleteContact);

export default router;

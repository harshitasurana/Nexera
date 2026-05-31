import mongoose, { type Document, type Model } from "mongoose";

export interface IContact extends Document {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  service: string;
  message: string;
  status: "New" | "Contacted" | "In Progress" | "Closed";
  createdAt: Date;
}

const ContactSchema = new mongoose.Schema<IContact>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    company: { type: String, default: "", trim: true },
    service: { type: String, required: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["New", "Contacted", "In Progress", "Closed"],
      default: "New",
    },
  },
  { timestamps: true }
);

const Contact: Model<IContact> = mongoose.models["Contact"] ?? mongoose.model<IContact>("Contact", ContactSchema);

export default Contact;

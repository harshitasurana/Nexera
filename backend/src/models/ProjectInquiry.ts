import mongoose, { type Document, type Model } from "mongoose";

export interface IProjectInquiry extends Document {
  name: string;
  email: string;
  company: string;
  budget: string;
  projectType: string;
  timeline: string;
  requirements: string;
  status: "New" | "Reviewed" | "In Discussion" | "Closed";
  createdAt: Date;
}

const ProjectInquirySchema = new mongoose.Schema<IProjectInquiry>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    company: { type: String, default: "", trim: true },
    budget: { type: String, default: "" },
    projectType: { type: String, required: true },
    timeline: { type: String, default: "" },
    requirements: { type: String, required: true },
    status: {
      type: String,
      enum: ["New", "Reviewed", "In Discussion", "Closed"],
      default: "New",
    },
  },
  { timestamps: true }
);

const ProjectInquiry: Model<IProjectInquiry> =
  mongoose.models["ProjectInquiry"] ?? mongoose.model<IProjectInquiry>("ProjectInquiry", ProjectInquirySchema);

export default ProjectInquiry;

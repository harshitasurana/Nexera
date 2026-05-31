import mongoose, { type Document, type Model } from "mongoose";

export interface ICareer extends Document {
  title: string;
  department: string;
  location: string;
  employmentType: "Full-time" | "Part-time" | "Internship" | "Remote";
  experience: string;
  salaryRange: string;
  skills: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  applicationEmail: string;
  status: "Open" | "Closed";
  createdAt: Date;
  updatedAt: Date;
}

const CareerSchema = new mongoose.Schema<ICareer>(
  {
    title: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Remote"],
      default: "Full-time",
    },
    experience: { type: String, default: "" },
    salaryRange: { type: String, default: "" },
    skills: [{ type: String }],
    description: { type: String, required: true },
    responsibilities: [{ type: String }],
    requirements: [{ type: String }],
    benefits: [{ type: String }],
    applicationEmail: { type: String, default: "" },
    status: { type: String, enum: ["Open", "Closed"], default: "Open" },
  },
  { timestamps: true }
);

const Career: Model<ICareer> =
  mongoose.models["Career"] ?? mongoose.model<ICareer>("Career", CareerSchema);

export default Career;

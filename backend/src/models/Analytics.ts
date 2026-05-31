import mongoose, { type Document, type Model } from "mongoose";

export interface IAnalytics extends Document {
  event: "visit" | "contact_form" | "newsletter_signup" | "project_request";
  metadata: Record<string, unknown>;
  createdAt: Date;
}

const AnalyticsSchema = new mongoose.Schema<IAnalytics>(
  {
    event: {
      type: String,
      required: true,
      enum: ["visit", "contact_form", "newsletter_signup", "project_request"],
    },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

const Analytics: Model<IAnalytics> =
  mongoose.models["Analytics"] ?? mongoose.model<IAnalytics>("Analytics", AnalyticsSchema);

export default Analytics;

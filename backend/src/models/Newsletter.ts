import mongoose, { type Document, type Model } from "mongoose";

export interface INewsletter extends Document {
  email: string;
  subscribedAt: Date;
}

const NewsletterSchema = new mongoose.Schema<INewsletter>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    subscribedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

const Newsletter: Model<INewsletter> =
  mongoose.models["Newsletter"] ?? mongoose.model<INewsletter>("Newsletter", NewsletterSchema);

export default Newsletter;

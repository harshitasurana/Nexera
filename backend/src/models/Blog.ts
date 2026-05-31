import mongoose, { type Document, type Model } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  tags: string[];
  published: boolean;
  author: string;
  readTime: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new mongoose.Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    content: { type: String, required: true },
    excerpt: { type: String, default: "" },
    featuredImage: { type: String, default: "" },
    category: { type: String, default: "Technology" },
    tags: [{ type: String }],
    published: { type: Boolean, default: false },
    author: { type: String, default: "Nexera Team" },
    readTime: { type: Number, default: 5 },
  },
  { timestamps: true }
);

BlogSchema.pre("save", async function () {
  if (!this.slug && this.title) {
    this.slug = (this.title as string).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
  if (!this.excerpt && this.content) {
    this.excerpt = (this.content as string).replace(/<[^>]*>/g, "").substring(0, 160) + "…";
  }
  if (!this.readTime && this.content) {
    this.readTime = Math.max(1, Math.round((this.content as string).split(" ").length / 200));
  }
});

const Blog: Model<IBlog> = mongoose.models["Blog"] ?? mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;

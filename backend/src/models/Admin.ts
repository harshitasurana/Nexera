import mongoose, { type Document, type Model } from "mongoose";
import bcryptjs from "bcryptjs";

export interface IAdmin extends Document {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const AdminSchema = new mongoose.Schema<IAdmin>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, default: "Admin" },
  },
  { timestamps: true }
);

AdminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcryptjs.hash(this.password as string, 12);
});

AdminSchema.methods["comparePassword"] = async function (candidate: string): Promise<boolean> {
  return bcryptjs.compare(candidate, this.password as string);
};

const Admin: Model<IAdmin> = mongoose.models["Admin"] ?? mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;

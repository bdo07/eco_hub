import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Should be hashed
  createdAt: { type: Date, default: Date.now },
});

AdminSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
  }
});

export const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

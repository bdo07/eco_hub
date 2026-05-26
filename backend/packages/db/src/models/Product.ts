import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  categoryId: { type: String, required: true },
  categoryName: { type: String }, // Virtual or populated would be better, but keeping it simple for now
  images: [{ type: String }],
  stock: { type: Number, default: 0 },
  colors: [{ type: String }],
  handmadeDetails: { type: String },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// For backward compatibility with integer IDs, we could use a virtual 'id'
// or just use string IDs everywhere. I'll use standard _id but map it to 'id' in JSON.
ProductSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
  }
});

export const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

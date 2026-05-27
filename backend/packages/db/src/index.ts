import mongoose from "mongoose";
import { Product } from "./models/Product";
import { Category } from "./models/Category";
import { Order } from "./models/Order";
import { Admin } from "./models/Admin";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable must be set.");
}

// Connect to MongoDB
mongoose.connect(MONGODB_URI).catch((err) => {
  console.error("Failed to connect to MongoDB:", err.message);
  process.exit(1);
});

export const db = mongoose.connection;
export { Product, Category, Order, Admin };
export * from "./models/Product";
export * from "./models/Category";
export * from "./models/Order";
export * from "./models/Admin";

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Admin } from "@workspace/db";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI must be set.");
  process.exit(1);
}

async function seed() {
  await mongoose.connect(MONGODB_URI!);
  
  const username = "admin";
  const password = "admin123";
  
  const existing = await Admin.findOne({ username });
  if (existing) {
    console.log("Admin user already exists");
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({
      username,
      password: hashedPassword,
    });
    await admin.save();
    console.log(`Admin user created: ${username} / ${password}`);
  }
  
  await mongoose.disconnect();
}

seed().catch(console.error);

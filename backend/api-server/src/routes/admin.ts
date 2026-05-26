import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { AdminLoginBody } from "@workspace/api-zod";
import { Admin } from "@workspace/db";

const router: IRouter = Router();

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { username, password } = parsed.data;
  
  const admin = await Admin.findOne({ username });
  if (!admin) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const isValid = await bcrypt.compare(password, admin.password);
  if (!isValid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  // Set a simple session cookie
  res.cookie("admin_session", "authenticated", {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "lax",
  });
  res.json({ username, authenticated: true });
});

router.get("/admin/me", async (req, res): Promise<void> => {
  const session = req.cookies?.admin_session;
  if (session !== "authenticated") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.json({ username: "admin", authenticated: true });
});

router.post("/admin/logout", async (req, res): Promise<void> => {
  res.clearCookie("admin_session");
  res.json({ success: true });
});

export default router;

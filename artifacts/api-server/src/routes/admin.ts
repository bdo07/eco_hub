import { Router, type IRouter } from "express";
import { AdminLoginBody } from "@workspace/api-zod";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

const router: IRouter = Router();

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { username, password } = parsed.data;
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
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
  res.json({ username: ADMIN_USERNAME, authenticated: true });
});

export default router;

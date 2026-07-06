import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { connectDb } from "./mongodb";
import { Admin } from "./models";

const secret = process.env.JWT_SECRET ?? "dev-secret";

export function signToken(adminId: string) {
  return jwt.sign({ id: adminId }, secret, { expiresIn: "24h" });
}

export async function requireAdmin(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, secret) as { id: string };
    await connectDb();
    return Admin.findById(decoded.id);
  } catch {
    return null;
  }
}

export async function ensureInitialAdmin() {
  const bcrypt = await import("bcryptjs");
  await connectDb();
  const username = process.env.ADMIN_USERNAME ?? "admin";
  if (await Admin.findOne({ username })) return;
  const password = process.env.ADMIN_PASSWORD ?? "admin";
  await Admin.create({ username, password: await bcrypt.hash(password, 10) });
}

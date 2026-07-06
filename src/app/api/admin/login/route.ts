import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ensureInitialAdmin, signToken } from "@/lib/auth";
import { connectDb } from "@/lib/mongodb";
import { Admin } from "@/lib/models";

export async function POST(req: NextRequest) {
  await ensureInitialAdmin();
  const { username, password } = await req.json();
  await connectDb();
  const admin = await Admin.findOne({ username });
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  return NextResponse.json({ token: signToken(String(admin._id)) });
}

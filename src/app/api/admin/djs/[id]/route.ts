import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectDb } from "@/lib/mongodb";
import { DJ, serialize } from "@/lib/models";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, ctx: Ctx) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  await connectDb();
  const dj = await DJ.findByIdAndUpdate(id, await req.json(), { new: true });
  if (!dj) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(serialize(dj));
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  await connectDb();
  await DJ.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}

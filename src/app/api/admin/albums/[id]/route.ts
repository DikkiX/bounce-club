import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectDb } from "@/lib/mongodb";
import { Album, serialize } from "@/lib/models";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, ctx: Ctx) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  await connectDb();
  const album = await Album.findByIdAndUpdate(id, await req.json(), { new: true });
  if (!album) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(serialize(album));
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  await connectDb();
  await Album.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}

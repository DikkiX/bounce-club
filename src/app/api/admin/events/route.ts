import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectDb } from "@/lib/mongodb";
import { Event, serialize } from "@/lib/models";

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDb();
  const event = await Event.create(await req.json());
  return NextResponse.json(serialize(event), { status: 201 });
}

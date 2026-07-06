import { NextResponse } from "next/server";
import { getEvents } from "@/lib/data";

export async function GET() {
  try {
    return NextResponse.json(await getEvents());
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

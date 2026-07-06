import { NextResponse } from "next/server";
import { getDjs } from "@/lib/data";

export async function GET() {
  try {
    return NextResponse.json(await getDjs());
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

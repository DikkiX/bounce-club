import { NextResponse } from "next/server";
import { getAlbums } from "@/lib/data";

export async function GET() {
  try {
    return NextResponse.json(await getAlbums());
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

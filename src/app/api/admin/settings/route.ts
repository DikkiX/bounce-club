import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getSiteSettings, updateSiteSettings } from "@/lib/siteSettings";

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getSiteSettings());
}

export async function PUT(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const heroVideo = typeof body.heroVideo === "string" ? body.heroVideo : undefined;
  if (heroVideo && !/\.(mp4|mov|webm)$/i.test(heroVideo)) {
    return NextResponse.json({ error: "Hero must be a video file" }, { status: 400 });
  }
  const settings = await updateSiteSettings({ heroVideo });
  return NextResponse.json(settings);
}

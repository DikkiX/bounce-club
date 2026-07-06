import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getLocalGalleryMedia } from "@/lib/localGallery";
import { getSiteSettings } from "@/lib/siteSettings";

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const [media, settings] = await Promise.all([getLocalGalleryMedia(), getSiteSettings()]);
  return NextResponse.json({ media: media.filter((m) => m.type === "video"), settings });
}

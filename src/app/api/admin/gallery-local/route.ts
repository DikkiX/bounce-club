import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getGalleryMeta, updateGalleryMeta } from "@/lib/galleryMeta";
import { getLocalGalleryMedia } from "@/lib/localGallery";

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const [media, meta] = await Promise.all([getLocalGalleryMedia({ includeHidden: true }), getGalleryMeta()]);
  return NextResponse.json({ items: media, meta });
}

export async function PUT(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const filename = String(body.filename ?? "");
  if (!filename) {
    return NextResponse.json({ error: "filename required" }, { status: 400 });
  }

  const meta = await updateGalleryMeta(filename, {
    title: typeof body.title === "string" ? body.title.trim() : undefined,
    moodTag: typeof body.moodTag === "string" ? body.moodTag.trim() : undefined,
    photoCredit: typeof body.photoCredit === "string" ? body.photoCredit.trim() : undefined,
    hidden: body.hidden === true || body.hidden === "true",
  });

  return NextResponse.json({ ok: true, meta });
}

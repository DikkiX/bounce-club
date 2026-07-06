import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/auth";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("image") ?? form.get("file");
  const target = String(form.get("target") ?? "uploads");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const isImage = IMAGE_TYPES.includes(file.type);
  const isVideo = VIDEO_TYPES.includes(file.type);

  if (!isImage && !isVideo) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  const ext =
    path.extname(file.name) ||
    (isVideo ? ".mp4" : ".jpg");

  const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const dir =
    target === "gallery"
      ? path.join(process.cwd(), "public", "gallery")
      : path.join(process.cwd(), "public", "uploads");

  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));

  const url =
    target === "gallery"
      ? `/gallery/${name}`
      : `/uploads/${name}`;

  return NextResponse.json({ imageUrl: url, url, type: isVideo ? "video" : "image" });
}

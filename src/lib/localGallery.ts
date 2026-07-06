import { readdir } from "fs/promises";
import path from "path";
import { getGalleryMeta } from "./galleryMeta";

export type LocalMedia = {
  src: string;
  type: "image" | "video";
  title: string;
  filename?: string;
  moodTag?: string;
  photoCredit?: string;
  hidden?: boolean;
};

const IMG_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const VID_EXT = new Set([".mp4", ".mov", ".webm"]);

function prettyTitle(filename: string) {
  return filename
    .replace(/-cropped/gi, "")
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();
}

function defaultMood(type: "image" | "video") {
  return type === "video" ? "AFTERMOVIE" : "NIGHTSHOT";
}

export async function getLocalGalleryMedia(opts?: { includeHidden?: boolean }): Promise<LocalMedia[]> {
  const dir = path.join(process.cwd(), "public", "gallery", "processed");
  const files = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const meta = await getGalleryMeta();
  const media: LocalMedia[] = [];

  for (const f of files.filter((entry) => entry.isFile()).sort((a, b) => a.name.localeCompare(b.name))) {
    const ext = path.extname(f.name).toLowerCase();
    const entry = meta[f.name];
    if (entry?.hidden && !opts?.includeHidden) continue;

    const base = {
      src: `/gallery/processed/${encodeURIComponent(f.name)}`,
      filename: f.name,
      title: entry?.title ?? prettyTitle(f.name),
      moodTag: entry?.moodTag ?? undefined,
      photoCredit: entry?.photoCredit,
      hidden: entry?.hidden ?? false,
    };

    if (IMG_EXT.has(ext)) {
      media.push({ ...base, type: "image", moodTag: base.moodTag ?? defaultMood("image") });
      continue;
    }
    if (VID_EXT.has(ext)) {
      media.push({ ...base, type: "video", moodTag: base.moodTag ?? defaultMood("video") });
    }
  }

  return media;
}

export async function getHeroBackgroundMedia(): Promise<LocalMedia | null> {
  const { getSiteSettings } = await import("./siteSettings");
  const [media, settings] = await Promise.all([getLocalGalleryMedia(), getSiteSettings()]);
  const videos = media.filter((m) => m.type === "video");
  if (!videos.length) return null;

  const preferred = videos.find((v) => v.filename === settings.heroVideo);
  if (preferred) return preferred;

  const bounceAftermovie = videos.find((v) => v.filename?.includes("bounce-aftermovie"));
  return bounceAftermovie ?? videos[1] ?? videos[0];
}

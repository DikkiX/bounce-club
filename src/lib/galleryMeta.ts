import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

export type GalleryMetaEntry = {
  title?: string;
  moodTag?: string;
  photoCredit?: string;
  hidden?: boolean;
};

export type GalleryMeta = Record<string, GalleryMetaEntry>;

const META_PATH = path.join(process.cwd(), "data", "gallery-meta.json");

export async function getGalleryMeta(): Promise<GalleryMeta> {
  try {
    const raw = await readFile(META_PATH, "utf8");
    return JSON.parse(raw) as GalleryMeta;
  } catch {
    return {};
  }
}

export async function updateGalleryMeta(filename: string, patch: GalleryMetaEntry): Promise<GalleryMeta> {
  const current = await getGalleryMeta();
  const next = {
    ...current,
    [filename]: { ...current[filename], ...patch },
  };
  await mkdir(path.dirname(META_PATH), { recursive: true });
  await writeFile(META_PATH, JSON.stringify(next, null, 2));
  return next;
}

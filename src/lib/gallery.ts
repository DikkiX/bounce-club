export type GalleryCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type GalleryMediaItem = {
  id: string;
  src: string;
  type: "image" | "video";
  order: number;
  photoCredit?: string;
  crop?: GalleryCrop;
};

export type GalleryAlbum = {
  id: string;
  title: string;
  date: string;
  description?: string;
  media: GalleryMediaItem[];
  moodTag?: string;
  photoCredit?: string;
};

export const FULL_CROP: GalleryCrop = { x: 0, y: 0, width: 100, height: 100 };

/** Legacy crops used x/y as focal point + zoom; convert to rectangle. */
export function normalizeCrop(crop?: Partial<GalleryCrop> & { zoom?: number }): GalleryCrop {
  if (
    crop &&
    typeof crop.width === "number" &&
    typeof crop.height === "number" &&
    crop.width > 0 &&
    crop.height > 0
  ) {
    return {
      x: clampPct(crop.x ?? 0),
      y: clampPct(crop.y ?? 0),
      width: clampPct(crop.width, 1, 100),
      height: clampPct(crop.height, 1, 100),
    };
  }

  const zoom = typeof crop?.zoom === "number" && crop.zoom > 1 ? crop.zoom : 1;
  if (zoom > 1) {
    const size = 100 / zoom;
    return {
      x: clampPct((crop?.x ?? 50) - size / 2),
      y: clampPct((crop?.y ?? 50) - size / 2),
      width: size,
      height: size,
    };
  }

  return FULL_CROP;
}

function clampPct(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

export function cropWrapperStyle(crop?: GalleryCrop): {
  wrapper: Record<string, string | number>;
  media: Record<string, string | number>;
} {
  const c = normalizeCrop(crop);
  const scaleW = 100 / c.width;
  const scaleH = 100 / c.height;

  return {
    wrapper: { overflow: "hidden", position: "relative", width: "100%", height: "100%" },
    media: {
      position: "absolute",
      width: `${scaleW * 100}%`,
      height: `${scaleH * 100}%`,
      left: `${-(c.x / c.width) * 100}%`,
      top: `${-(c.y / c.height) * 100}%`,
      maxWidth: "none",
      objectFit: "cover" as const,
    },
  };
}

export function mediaId(index: number, src: string) {
  return `m-${index}-${src.split("/").pop()?.slice(0, 12) ?? index}`;
}

export function normalizeAlbum(raw: Record<string, unknown>): GalleryAlbum {
  const id = String(raw.id ?? raw._id ?? "");
  const title = String(raw.title ?? "");
  const date = String(raw.date ?? "");
  const description = raw.description ? String(raw.description) : undefined;
  const moodTag = raw.moodTag ? String(raw.moodTag) : undefined;
  const photoCredit = raw.photoCredit ? String(raw.photoCredit) : undefined;

  const existing = Array.isArray(raw.media) ? raw.media : [];
  let media: GalleryMediaItem[] = existing.map((item, index) => {
    const m = item as Record<string, unknown>;
    return {
      id: String(m.id ?? mediaId(index, String(m.src ?? ""))),
      src: String(m.src ?? ""),
      type: (m.type === "video" ? "video" : "image") as "image" | "video",
      order: typeof m.order === "number" ? m.order : index,
      photoCredit: m.photoCredit ? String(m.photoCredit) : undefined,
      crop: normalizeCrop(m.crop as GalleryCrop & { zoom?: number }),
    };
  });

  if (!media.length) {
    const legacyThumb = raw.thumbnail ? String(raw.thumbnail) : "";
    const legacyImages = Array.isArray(raw.images) ? raw.images.map(String) : [];
    const urls = legacyThumb
      ? [legacyThumb, ...legacyImages.filter((u) => u !== legacyThumb)]
      : legacyImages;

    media = urls.map((src, index) => ({
      id: mediaId(index, src),
      src,
      type: src.match(/\.(mp4|webm|mov)(\?|$)/i) ? "video" : "image",
      order: index,
      crop: FULL_CROP,
    }));
  }

  media.sort((a, b) => a.order - b.order);

  return { id, title, date, description, media, moodTag, photoCredit };
}

export function albumCover(album: GalleryAlbum): GalleryMediaItem | null {
  return album.media[0] ?? null;
}

export function albumCoverSrc(album: GalleryAlbum): string {
  return albumCover(album)?.src ?? "";
}

export function isFullCrop(crop?: GalleryCrop) {
  const c = normalizeCrop(crop);
  return c.x === 0 && c.y === 0 && c.width === 100 && c.height === 100;
}

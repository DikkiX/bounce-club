/**
 * Seeds "Test Gallery" with all files from public/gallery/processed
 * Usage: node scripts/seed-test-gallery.mjs
 */
import { readFileSync } from "fs";
import { readdir } from "fs/promises";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnvLocal() {
  try {
    const raw = readFileSync(path.join(__dirname, "..", ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const i = trimmed.indexOf("=");
      if (i === -1) continue;
      const key = trimmed.slice(0, i);
      const val = trimmed.slice(i + 1);
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // .env.local optional
  }
}

loadEnvLocal();

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017/bounce-club";
const GALLERY_TITLE = "Test Gallery";

const IMG_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const VID_EXT = new Set([".mp4", ".mov", ".webm"]);

const galleryCropSchema = new mongoose.Schema(
  { x: Number, y: Number, width: Number, height: Number },
  { _id: false },
);

const galleryMediaSchema = new mongoose.Schema(
  {
    id: String,
    src: String,
    type: { type: String, enum: ["image", "video"] },
    order: Number,
    photoCredit: String,
    crop: { type: galleryCropSchema, default: () => ({ x: 0, y: 0, width: 100, height: 100 }) },
  },
  { _id: false },
);

const albumSchema = new mongoose.Schema({
  title: String,
  date: Date,
  description: String,
  media: [galleryMediaSchema],
  thumbnail: String,
  images: [String],
});

const Album = mongoose.models.Album || mongoose.model("Album", albumSchema);

function mediaId(index, filename) {
  return `seed-${index}-${filename.slice(0, 16)}`;
}

async function loadProcessedFiles() {
  const dir = path.join(__dirname, "..", "public", "gallery", "processed");
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const items = [];

  for (const entry of entries.filter((e) => e.isFile()).sort((a, b) => a.name.localeCompare(b.name))) {
    const ext = path.extname(entry.name).toLowerCase();
    const src = `/gallery/processed/${encodeURIComponent(entry.name)}`;
    if (IMG_EXT.has(ext)) {
      items.push({ src, type: "image", filename: entry.name });
    } else if (VID_EXT.has(ext)) {
      items.push({ src, type: "video", filename: entry.name });
    }
  }

  return items;
}

async function main() {
  const files = await loadProcessedFiles();
  if (!files.length) {
    console.log("No processed gallery files found in public/gallery/processed");
    process.exit(0);
  }

  await mongoose.connect(MONGODB_URI);

  let album = await Album.findOne({ title: GALLERY_TITLE });

  const media = files.map((file, index) => ({
    id: mediaId(index, file.filename),
    src: file.src,
    type: file.type,
    order: index,
    crop: { x: 0, y: 0, width: 100, height: 100 },
  }));

  if (album) {
    const existingSrc = new Set((album.media ?? []).map((m) => m.src));
    const merged = (album.media ?? []).map((m) => ({
      id: m.id,
      src: m.src,
      type: m.type,
      order: m.order,
      photoCredit: m.photoCredit,
      crop: m.crop ?? { x: 0, y: 0, width: 100, height: 100 },
    }));
    for (const item of media) {
      if (!existingSrc.has(item.src)) {
        merged.push({ ...item, order: merged.length, id: mediaId(merged.length, item.src.split("/").pop()) });
      }
    }
    album.media = merged.map((m, i) => ({ ...m, order: i }));
    album.thumbnail = merged[0]?.src ?? album.thumbnail;
    album.images = merged.map((m) => m.src);
    await album.save();
    console.log(`Updated "${GALLERY_TITLE}" — ${merged.length} items total`);
  } else {
    album = await Album.create({
      title: GALLERY_TITLE,
      date: new Date(),
      description: "Imported from gallery/processed folder",
      media,
      thumbnail: media[0]?.src,
      images: media.map((m) => m.src),
    });
    console.log(`Created "${GALLERY_TITLE}" with ${media.length} items`);
  }

  for (const m of album.media) {
    console.log(`  · [${m.type}] ${m.src}`);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

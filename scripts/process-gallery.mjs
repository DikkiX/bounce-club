#!/usr/bin/env node

import { readdir, mkdir, rm } from "node:fs/promises";
import { extname, join, basename } from "node:path";
import { spawn } from "node:child_process";

const SOURCE_DIR = join(process.cwd(), "public", "gallery");
const OUTPUT_DIR = join(SOURCE_DIR, "processed");
const CROP_RATIO = process.env.GALLERY_CROP_RATIO || "0.86";

const IMG_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const VID_EXT = new Set([".mov", ".mp4", ".webm"]);

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const child = spawn("ffmpeg", args, { stdio: "ignore" });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });
}

function slugify(file) {
  return basename(file, extname(file))
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/--+/g, "-");
}

async function main() {
  const dirEntries = await readdir(SOURCE_DIR, { withFileTypes: true });
  const media = dirEntries.filter((f) => f.isFile() && !f.name.startsWith("."));

  await rm(OUTPUT_DIR, { recursive: true, force: true });
  await mkdir(OUTPUT_DIR, { recursive: true });

  for (const file of media) {
    const ext = extname(file.name).toLowerCase();
    const input = join(SOURCE_DIR, file.name);
    const base = slugify(file.name);

    if (IMG_EXT.has(ext)) {
      const output = join(OUTPUT_DIR, `${base}-cropped.jpg`);
      await runFfmpeg(["-y", "-i", input, "-vf", `crop=in_w:in_h*${CROP_RATIO}:0:0`, "-q:v", "2", output]);
      continue;
    }

    if (VID_EXT.has(ext)) {
      const output = join(OUTPUT_DIR, `${base}-cropped.mp4`);
      await runFfmpeg([
        "-y",
        "-i",
        input,
        "-vf",
        `crop=in_w:in_h*${CROP_RATIO}:0:0`,
        "-c:v",
        "libx264",
        "-preset",
        "medium",
        "-crf",
        "20",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        output,
      ]);
    }
  }

  // eslint-disable-next-line no-console
  console.log(`Processed ${media.length} items into public/gallery/processed`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err.message || err);
  process.exit(1);
});


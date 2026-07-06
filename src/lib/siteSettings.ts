import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

export type SiteSettings = {
  heroVideo?: string;
};

const SETTINGS_PATH = path.join(process.cwd(), "data", "site-settings.json");

const DEFAULTS: SiteSettings = {
  heroVideo: "bounce-aftermovie-cropped.mp4",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const raw = await readFile(SETTINGS_PATH, "utf8");
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

export async function updateSiteSettings(patch: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSiteSettings();
  const next = { ...current, ...patch };
  await mkdir(path.dirname(SETTINGS_PATH), { recursive: true });
  await writeFile(SETTINGS_PATH, JSON.stringify(next, null, 2));
  return next;
}

import { connectDb } from "./mongodb";
import { Album, DJ, Event, serialize } from "./models";
import { normalizeAlbum } from "./gallery";

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error("[data]", err);
    return fallback;
  }
}

export async function getEvents() {
  return safe(async () => {
    await connectDb();
    return Event.find().sort({ date: 1 }).then((docs) => docs.map(serialize));
  }, []);
}

export async function getDjs() {
  return safe(async () => {
    await connectDb();
    return DJ.find().then((docs) => docs.map(serialize));
  }, []);
}

export async function getAlbums() {
  return safe(async () => {
    await connectDb();
    return Album.find()
      .sort({ date: -1 })
      .then((docs) => docs.map((doc) => normalizeAlbum(serialize(doc) as Record<string, unknown>)));
  }, []);
}

export function getNextEvent(events: Awaited<ReturnType<typeof getEvents>>) {
  const now = new Date();
  return events.find((e) => new Date(e.date) >= now) ?? events[events.length - 1] ?? null;
}

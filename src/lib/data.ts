import { connectDb } from "./mongodb";
import { Album, DJ, Event, serialize } from "./models";
import { normalizeAlbum } from "./gallery";

export async function getEvents() {
  await connectDb();
  return Event.find().sort({ date: 1 }).then((docs) => docs.map(serialize));
}

export async function getDjs() {
  await connectDb();
  return DJ.find().then((docs) => docs.map(serialize));
}

export async function getAlbums() {
  await connectDb();
  return Album.find()
    .sort({ date: -1 })
    .then((docs) => docs.map((doc) => normalizeAlbum(serialize(doc) as Record<string, unknown>)));
}

export function getNextEvent(events: Awaited<ReturnType<typeof getEvents>>) {
  const now = new Date();
  return events.find((e) => new Date(e.date) >= now) ?? events[events.length - 1] ?? null;
}

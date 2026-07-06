import mongoose, { Schema, models, model } from "mongoose";

const adminSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const eventSchema = new Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  description: { type: String, required: true },
  artists: [String],
  image: String,
  ticketUrl: String,
  featured: { type: Boolean, default: false },
});

const djSchema = new Schema({
  name: { type: String, required: true },
  genre: { type: String, required: true },
  bio: { type: String, required: true },
  image: { type: String, required: true },
  social: {
    instagram: String,
    soundcloud: String,
    spotify: String,
  },
});

const galleryCropSchema = new Schema(
  {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    width: { type: Number, default: 100 },
    height: { type: Number, default: 100 },
  },
  { _id: false },
);

const galleryMediaSchema = new Schema(
  {
    id: String,
    src: { type: String, required: true },
    type: { type: String, enum: ["image", "video"], default: "image" },
    order: { type: Number, default: 0 },
    photoCredit: String,
    crop: { type: galleryCropSchema, default: () => ({ x: 0, y: 0, width: 100, height: 100 }) },
  },
  { _id: false },
);

const albumSchema = new Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: String,
  media: [galleryMediaSchema],
  // legacy fields kept for backwards compatibility
  thumbnail: String,
  images: [String],
  photoCredit: String,
  moodTag: String,
  cropFocus: String,
});

export const Admin = models.Admin || model("Admin", adminSchema);
export const Event = models.Event || model("Event", eventSchema);
export const DJ = models.DJ || model("DJ", djSchema);
export const Album = models.Album || model("Album", albumSchema);

export function serialize<T extends Record<string, unknown> & { _id: mongoose.Types.ObjectId }>(
  doc: T & { toObject?: () => T },
) {
  const obj = doc.toObject ? doc.toObject() : doc;
  return { ...obj, id: String(obj._id), _id: String(obj._id) };
}

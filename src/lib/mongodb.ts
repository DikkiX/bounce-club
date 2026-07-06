import mongoose from "mongoose";

const uri = process.env.MONGODB_URI ?? "mongodb://localhost:27017/bounce-club";

interface Cache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: Cache | undefined;
}

const cache: Cache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cache;

export async function connectDb() {
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose.connect(uri);
  }
  cache.conn = await cache.promise;
  return cache.conn;
}

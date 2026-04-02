import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'MONGODB_URI is not set. Create a .env.local file with:\n' +
    'MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/vibekit-studio'
  );
}

// Cache the connection across hot-reloads in development
let cached = global._mongoose;
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // Reset so next call retries
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

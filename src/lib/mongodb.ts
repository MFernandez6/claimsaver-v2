import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable. Check your .env.local file and production environment variables."
  );
}

// At this point, MONGODB_URI is guaranteed to be a string
const MONGODB_URI_STRING: string = MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      retryReads: true,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI_STRING, opts)
      .then((mongoose) => {
        console.log("MongoDB connected successfully");
        return mongoose;
      })
      .catch((error) => {
        console.error("MongoDB connection failed:", error);

        if (error.message.includes("whitelist")) {
          throw new Error(
            "MongoDB Atlas IP whitelist error. Please add your deployment IP to MongoDB Atlas whitelist or use 0.0.0.0/0 for all IPs. See: https://www.mongodb.com/docs/atlas/security-whitelist/"
          );
        }

        if (error.message.includes("authentication")) {
          throw new Error(
            "MongoDB authentication failed. Please check your connection string and credentials."
          );
        }

        if (error.message.includes("ENOTFOUND")) {
          throw new Error(
            "MongoDB host not found. Please check your connection string."
          );
        }

        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("MongoDB connection error:", e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;

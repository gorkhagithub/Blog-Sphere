const mongoose = require('mongoose');
const dns = require('dns');

// Cached connection for Serverless environments (Vercel)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    // Use Google DNS to resolve MongoDB Atlas SRV records
    // (Some ISPs / networks block SRV lookups on default DNS)
    dns.setServers(['8.8.8.8', '8.8.4.4']);

    const opts = {
      bufferCommands: false,
      family: 4, // Force IPv4 to avoid DNS resolution issues
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    };

    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

module.exports = connectDB;

const mongoose = require('mongoose');

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
    const opts = {
      bufferCommands: false,
    };
    
    // In production (Vercel), we don't need Google DNS. In dev we do.
    if (process.env.NODE_ENV !== 'production') {
       const dns = require('dns');
       dns.setServers(['8.8.8.8', '8.8.4.4']);
       opts.family = 4;
    }

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

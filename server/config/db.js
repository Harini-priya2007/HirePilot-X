const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'hirepilotx',
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('⚠️  Server will continue running. Fix MongoDB Atlas IP whitelist to resolve.');
    console.error('   → Go to: https://cloud.mongodb.com → Network Access → Add 0.0.0.0/0');
  }
};

module.exports = connectDB;

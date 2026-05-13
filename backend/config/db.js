const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️  MongoDB Connection Warning: ${error.message}`);
    console.warn('ℹ️  API will run but database operations will fail. Please configure MONGO_URI.');
    console.warn('ℹ️  Get a free MongoDB Atlas cluster at: https://mongodb.com/cloud/atlas');
    // Don't exit, allow server to continue running
  }
};

module.exports = connectDB;

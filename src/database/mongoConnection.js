const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/historiasClinicas';

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;

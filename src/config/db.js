const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    console.log('MongoDB URI:', process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI, {
      // No need to include useNewUrlParser or useUnifiedTopology
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

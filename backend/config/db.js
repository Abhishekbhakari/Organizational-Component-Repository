require('dotenv').config();

const mongoose = require('mongoose');
const config = require('config');
const db = process.env.MONGO_URI;

console.log(db)
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

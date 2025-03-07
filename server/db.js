const mongoose = require("mongoose");
require("dotenv").config(); 

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI ;
    if (!mongoURI) {
      throw new Error(" MONGO_URI is not defined in .env file");
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1); // Exit process if connection fails
  }
};

module.exports = connectDB;

const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

async function connectToDB() {
  try {
    console.log("Attempting MongoDB connection...");
    console.log("MONGO_URI exists:", !!process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to DB");
  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error);
    throw error;
  }
}
module.exports = connectToDB;

const mongoose = require("mongoose");

const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

async function connectToDB() {
  console.log("========== DB CONNECTION START ==========");
  console.log("MONGO_URI exists:", !!process.env.MONGO_URI);

  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("========== CONNECTED TO MONGODB ==========");
    console.log("readyState:", mongoose.connection.readyState);
  } catch (error) {
    console.error("========== MONGODB CONNECTION FAILED ==========");
    console.error(error);
    throw error;
  }
}

module.exports = connectToDB;
const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");
  } catch (error) {
    console.log(error);
    throw error
  }
}
module.exports = connectToDB;

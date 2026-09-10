require("dotenv").config()
const app = require("../resumeCraft-backend/src/app")
const connectToDB = require("../resumeCraft-backend/src/config/database")


connectToDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT ${process.env.PORT}`);
  });
}).catch((error) => {
  console.error("Database connection failed:", error);
  process.exit(1);
});
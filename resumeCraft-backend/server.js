require("dotenv").config()
const app = require("../resumeCraft-backend/src/app")
const connectToDB = require("./src/config/database")


connectToDB();

app.listen(process.env.PORT,()=>{
    console.log(`Server started on PORT ${process.env.PORT}`)
})
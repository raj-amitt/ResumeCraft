require("dotenv").config()
const app = require("../resumeCraft-backend/src/app")
const connectToDB = require("../resumeCraft-backend/src/config/database")


connectToDB();

app.listen(process.env.PORT,()=>{
    console.log(`Server started on PORT ${process.env.PORT}`)
})
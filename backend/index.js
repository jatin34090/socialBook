const express = require("express")
const mongoose = require("mongoose")
const app = express();
require('dotenv').config()

const PORT = 5000 || process.env.PORT

mongoose.connect(process.env.MONGOURI).then(()=>{
    
    console.log("Connected to mongoDB")
})
.catch((err) => {
    console.log("Error connecting to mongoDB", err)
})


app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))



app.listen(PORT, () => {
    console.log("server is running on port 5000")
})
const express = require("express")
const mongoose = require("mongoose")
const {MONGOURI} = require("./keys")
const app = express();



mongoose.connect(MONGOURI).then(()=>{
    
    console.log("Connected to mongoDB")
})
.catch((err) => {
    console.log("Error connecting to mongoDB", err)
})


app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))



app.listen(5000, () => {
    console.log("server is running on port 5000")
})
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    followers:[{
        type: mongoose.Schema.Types.ObjectId,
         ref: "User" 
    }],
    following:[{
        type: mongoose.Schema.Types.ObjectId,
         ref: "User" 
    }],
    pic:{
        type:String,
        default:"https://res.cloudinary.com/dbvyslsdc/image/upload/v1713746815/noimage_vcqmbk.jpg"
    },
    resetToken:String,
    expiresTime:Date
 
})
const User = mongoose.model("User", userSchema);
module.exports = User;

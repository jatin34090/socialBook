const express = require("express")
const router = express.Router()
const crypto = require("crypto")
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const { body, validationResult } = require('express-validator');

const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'princejatin10008@gmail.com',
    pass: 'zvmb rscz lfgf rymd'
  }
});
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/api/signin", (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(422).json({ error: "Please add email or password" })
  }
  User.findOne({ email: email })
    .then((savedUser) => {

      if (!savedUser) {
        return res.status(422).json({ error: "Invalid email or password" })
      }
      bcrypt.compare(password, savedUser.password).then(doMatch => {
        if (doMatch) {
          // res.json({ message: "Successfully signed in" })
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
          const { _id, name, email, followers, following, pic } = savedUser
          res.json({ token, user: { _id, name, email, followers, following, pic } })
        } else {
          return res.status(422).json({ error: "Invalid email or password" })
        }
      })
        .catch(err => {

          console.log(err)
        })
    })
})

router.post("/api/signup", [
  body('name', 'Enter a valid Name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast minmum 5 characters').isLength({ min: 5 })
], (req, res) => {
  const { name, email, password, pic } = req.body
  if (!email || !name || !password) {
    return res.status(422).json({ error: "Please add all the fields" })
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: `${errors.array()[0].msg}` });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "User already exists with this email" })
      }
      bcrypt.hash(password, 12).then(hashedPassword => {

        const newUser = new User({
          email,
          name,
          password: hashedPassword,
          pic
        })
        newUser.save()
          .then((user) => {

            const token = jwt.sign({ _id: newUser._id }, JWT_SECRET)
            const { _id, name, email, followers, following } = newUser
            res.json({ token, user: { _id, name, email, followers, following } })

            transporter.sendMail({
              from: '"no-reply@gmail.com', // sender address
              to: user.email, // list of receivers
              subject: "Hello ✔", // Subject line
              text: "Signup Successfully on Social Book", // plain text body
              html: "<H1>Welcome to Social Book</H1>", // html body
            }).then((result) => {
              // console.log("mailer", result)
            }).catch((err) => {
              console.log("error mailer", err)
            })
          })
          .catch(err => {
            console.log(err)
          })
      }).catch(err => console.log(err))

    })
})

router.post("/api/resetpassword",(req,res)=>{

  crypto.randomBytes(32,(err,buffer)=>{
    if(err){
      console.log(err)
    }
    const token = buffer.toString("hex")
    User.findOne({email:req.body.email}).then((user)=>{
      if(!user){
        return res.status(422).json({error:"User does not exist with this email"})
      }
      user.resetToken = token
      user.expiresTime = Date.now() + 3600000
      user.save().then((result)=>{
        transporter.sendMail({
          from: '"no-reply@gmail.com', // sender address
          to: user.email, // list of receivers
          subject: "Reset Password", // Subject line
          html: `<p>Click here to reset your password <a href="http://localhost:5173/resetpassword/${token}">Reset Password</a></p>`,
          

        })
        res.json({message:"Check your email"})
      })
    })
  })
})

router.post('/api/newpassword',(req,res)=>{

  const newPassword = req.body.password
  const sentToken = req.body.token
  User.findOne({resetToken:sentToken,expiresTime:{$gt:Date.now()}})
  .then(user=>{
    if(!user){
      return res.status(422).json({error:"Try again session expired"})
    }
    bcrypt.hash(newPassword,12).then(hashedPassword=>{
      user.password = hashedPassword
      user.resetToken = undefined
      user.expiresTime = undefined
      user.save().then((savedUser)=>{
        res.json({message:"Password updated successfully"})
      })
    })
  }).catch(err=>{
    console.log(err)
  })

})

module.exports = router
const express = require("express")
const router = express.Router()
const requireLogin = require("../middleware/requireLogin")

const Post = require("../models/Post");
const User = require("../models/User");


router.get("/api/user/:id", requireLogin, (req, res) => {
    User.findOne({ _id: req.params.id })
        .select("-password")
        .then((user) => {
            Post.find({ postedBy: req.params.id })
                .populate("postedBy", "_id name")
                .then((posts) => {
                    res.json({ user, posts })
                })
                .catch((err) => {
                    return res.status(404).json({ error: err })
                })
        }).catch((err) => {
            return res.status(404).json({ error: "User not found" })
        })

})



router.put("/api/follow/:id", requireLogin, async (req, res) => {
    try {
        // Follow another user
        const followedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $push: { followers: req.user._id } },
            { new: true }
        ).select("-password");

        // Update current user's following list only if the first update is successful
        const currentUser = await User.findByIdAndUpdate(
            req.user._id,
            { $push: { following: req.params.id } },
            { new: true }
        ).select("-password");

        // Send response with updated user data
        res.json(currentUser);
    } catch (err) {
        // Handle errors
        res.status(422).json({ error: err.message });
    }
});
router.put("/api/unfollow/:id", requireLogin, async (req, res) => {
    try {
        // Follow another user
        const followedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $pull: { followers: req.user._id } },
            { new: true }
        ).select("-password");

        // Update current user's following list only if the first update is successful
        const currentUser = await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { following: req.params.id } },
            { new: true }
        ).select("-password");

        // Send response with updated user data
        res.json(currentUser);
    } catch (err) {
        // Handle errors
        return res.status(422).json({ error: err.message });
    }
});

router.put('/api/updatepic',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true}).then((result)=>{
        res.json(result)
    }).catch((err)=>{
        return res.status(422).json({ error:"pic cannot post"});
    })
})

router.post("/api/searchusers", (req, res) => {
    let pattern = new RegExp("^" + req.body.query)
    User.find({
        email: { $regex: pattern},
    })
    .select("_id email")
    .then((user) => {
        res.json({ user })
    }).catch((err) => {
        console.log(err)
    })
})





module.exports = router